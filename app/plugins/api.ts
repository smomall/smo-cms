/** 后端统一响应结构 */
interface ApiResponse<T = unknown> {
  code: number
  msg: string
  data: T
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const api = $fetch.create({
    baseURL: config.public.apiBaseURL,
    timeout: 15000,

    onRequest({ request, options }) {
      // 暂不实现
    },
    async onResponse({ response }) {
      const res = (response._data ?? null) as ApiResponse | null
      if (!res) {
        return
      }
      // 匹配后端 {code, msg, data} 结构
      if (res && typeof res === 'object' && 'code' in res) {
        // 自定义成功码，例如 code = 200 代表业务成功
        if (200 <= res.code && res.code < 300) {
          // 直接把 data 抛给调用方
          response._data = res.data ?? null
        } else {
          // 业务异常，手动抛出错误，携带code、msg
          throw createError({
            status: res.code,
            statusText: res.msg ?? response.statusText,
            data: res
          })
        }
      }
    },
    async onResponseError({ response }) {
      const res = (response._data ?? {}) as ApiResponse
      if (response.status === 401) {
        await nuxtApp.runWithContext(() => navigateTo('/login'))
      }
      // 抛出统一错误，方便上层捕获 code msg
      throw createError({
        status: res.code ?? response.status,
        statusText: res.msg ?? response.statusText,
        data: res
      })
    }
  })

  return {
    provide: {
      api
    }
  }
})
