import type { OpenCursorResult } from '~/types'
import type { MaybeRefOrGetter } from 'vue'

interface UseCursorPaginationOptions {
  /** API 端点 */
  endpoint: string
  /** 额外查询参数（响应式） */
  params?: MaybeRefOrGetter<Record<string, string | number>>
  /** 每页数量，默认 20 */
  pageSize?: number
}

/**
 * 通用游标分页组合式函数。
 *
 * 设计要点：
 * 1. 首屏（SSR 阶段）加载：在 setup 顶层同步调用 useAPI（useFetch），
 *    确保 Nuxt 正确等待并水合首屏数据，客户端不重复请求。
 * 2. 后续加载：使用 $api 直接请求，适用于无限滚动等客户端增量场景。
 * 3. 重新加载：筛选条件变化时调用 reload()，走客户端请求并替换结果。
 */
export function useCursorPagination<T>(
  options: UseCursorPaginationOptions
) {
  const items = ref<T[]>([])
  const cursor = ref<string | null>(null)
  const hasMore = ref(true)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const { endpoint, params, pageSize = 20 } = options
  const { $api } = useNuxtApp()

  function toError(e: unknown): Error {
    return e instanceof Error ? e : new Error(String(e))
  }

  function buildParams(includeCursor = false): Record<string, string | number> {
    const extra = params ? toValue(params) : {}
    const p: Record<string, string | number> = { pageSize, ...extra }
    if (includeCursor && cursor.value) p.cursor = cursor.value
    return p
  }

  function applyResult(
    result: OpenCursorResult<T> | null | undefined,
    isReplace = false
  ) {
    const records = result?.records ?? []
    if (isReplace) {
      items.value = records
    } else if (records.length) {
      items.value = [...(items.value as T[]), ...records]
    }
    cursor.value = result?.nextCursor ?? null
    hasMore.value = (result?.hasMore ?? false) && records.length > 0
  }

  // ==============================================================
  // 首屏加载：setup 顶层同步调用 useAPI（SSR 兼容关键）
  // ==============================================================
  const initialParams = computed(() => buildParams(false))
  const {
    data: initialData,
    pending: initialPending,
    error: initialFetchError,
    refresh
  } = useAPI<OpenCursorResult<T>>(endpoint, {
    method: 'GET',
    params: initialParams
  })

  // 监听初始加载结果（SSR 时 initialData 已携带水合数据）
  watch(
    [initialData, initialPending],
    ([data, pending], [, prevPending]) => {
      if (prevPending && !pending) {
        loading.value = false
        if (data) applyResult(data, true)
      }
      if (pending && !items.value.length) {
        loading.value = true
      }
    },
    { immediate: true }
  )

  watch(
    initialFetchError,
    (err) => {
      if (err) {
        error.value = toError(err)
        loading.value = false
      }
    },
    { immediate: true }
  )

  /**
   * 等待初始加载完成（保留原 API 兼容）。
   * 由于 useAPI 已在顶层自动执行，这里通常只是等待 pending 结束。
   */
  async function initialLoad() {
    if (!initialPending.value && initialData.value) {
      applyResult(initialData.value, true)
      loading.value = false
      return
    }
    await until(initialPending).toBe(false)
    if (initialData.value) applyResult(initialData.value, true)
    loading.value = false
  }

  /**
   * 后续加载：游标分页增量请求（仅客户端）
   */
  async function loadMore() {
    if (loading.value || !hasMore.value) return
    loading.value = true
    error.value = null
    try {
      const result = await $api<OpenCursorResult<T>>(endpoint, {
        method: 'GET',
        params: buildParams(true)
      })
      applyResult(result)
    } catch (e) {
      error.value = toError(e)
    } finally {
      loading.value = false
    }
  }

  function reset() {
    items.value = []
    cursor.value = null
    hasMore.value = true
    error.value = null
  }

  /**
   * 重新加载：筛选条件变化时调用（仅客户端，替换已有数据）
   */
  async function reload() {
    loading.value = true
    error.value = null
    reset()
    try {
      if (typeof refresh === 'function') {
        await refresh()
        if (initialData.value) applyResult(initialData.value, true)
      } else {
        const result = await $api<OpenCursorResult<T>>(endpoint, {
          method: 'GET',
          params: buildParams(false)
        })
        applyResult(result, true)
      }
    } catch (e) {
      error.value = toError(e)
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    loading,
    hasMore,
    error,
    initialLoad,
    loadMore,
    reload,
    reset
  }
}
