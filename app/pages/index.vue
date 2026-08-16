<template>
  <UContainer>
    <UPage>
      <template #left>
        <UPageAside>
          <UNavigationMenu
            orientation="vertical"
            :items="sidebarItems"
            default-open
            highlight
            highlight-color="primary"
            class="data-[orientation=vertical]:w-48"
          />
        </UPageAside>
      </template>
      <template #right>
        <UPageAside />
      </template>
      <UPageBody>
        <UTabs
          v-model="active"
          color="neutral"
          variant="link"
          :content="false"
          :items="tabItems"
          class="w-full"
        />

        <!-- 骨架屏 -->
        <div
          v-if="loading && !articles.length"
          class="space-y-2"
        >
          <UPageCard
            v-for="i in 5"
            :key="i"
            variant="outline"
            class="overflow-hidden"
          >
            <div class="flex gap-5">
              <div class="flex-1">
                <USkeleton class="h-5 w-3/4" />
                <USkeleton class="h-4 w-full" />
                <USkeleton class="h-4 w-5/6" />
                <div class="flex gap-2 pt-2">
                  <USkeleton class="h-5 w-16" />
                  <USkeleton class="h-5 w-16" />
                  <USkeleton class="h-5 w-16" />
                </div>
              </div>
              <USkeleton class="h-24 w-36 shrink-0 rounded-lg" />
            </div>
          </UPageCard>
        </div>

        <!-- 文章列表 -->
        <div
          v-else-if="articles.length"
          class="space-y-2"
        >
          <UPageCard
            v-for="article in articles"
            :key="article.id"
            :to="`/posts/${article.id}`"
            variant="outline"
            class="group cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40"
          >
            <div class="flex gap-5">
              <!-- 左侧：文本 -->
              <div class="flex-1 min-w-0 flex flex-col">
                <h3
                  class="text-base font-semibold line-clamp-1 group-hover:text-primary transition-colors"
                >
                  {{ article.title }}
                </h3>
                <p
                  v-if="article.description"
                  class="mt-2 text-sm text-muted line-clamp-2 flex-1"
                >
                  {{ article.description }}
                </p>
                <div class="mt-3 flex items-center gap-3 text-xs text-muted">
                  <span
                    v-if="article.publishAt"
                    class="flex items-center gap-1"
                  >
                    <UIcon
                      name="i-lucide-calendar"
                      class="h-3.5 w-3.5"
                    />
                    {{ formatDateCN(article.publishAt) }}
                  </span>
                  <span
                    v-if="article.viewCount != null"
                    class="flex items-center gap-1"
                  >
                    <UIcon
                      name="i-lucide-eye"
                      class="h-3.5 w-3.5"
                    />
                    {{ article.viewCount }}
                  </span>
                  <span
                    v-if="article.likeCount != null"
                    class="flex items-center gap-1"
                  >
                    <UIcon
                      name="i-lucide-heart"
                      class="h-3.5 w-3.5"
                    />
                    {{ article.likeCount }}
                  </span>
                  <span
                    v-if="article.commentCount != null"
                    class="flex items-center gap-1"
                  >
                    <UIcon
                      name="i-lucide-message-circle"
                      class="h-3.5 w-3.5"
                    />
                    {{ article.commentCount }}
                  </span>
                </div>
              </div>
              <!-- 右侧：封面图 -->
              <div class="shrink-0 rounded-lg overflow-hidden bg-elevated/30">
                <NuxtImg
                  v-if="article.cover"
                  :src="article.cover"
                  :alt="article.title"
                  loading="lazy"
                  decoding="async"
                  referrerpolicy="no-referrer"
                  class="h-24 w-36 object-cover"
                />
                <div
                  v-else
                  class="h-24 w-36 flex items-center justify-center"
                >
                  <UIcon
                    name="i-lucide-image"
                    class="h-8 w-8 text-muted opacity-40"
                  />
                </div>
              </div>
            </div>
          </UPageCard>
        </div>

        <!-- 加载更多 -->
        <div
          v-if="loading && articles.length"
          class="flex justify-center py-6"
        >
          <UIcon
            name="i-lucide-loader-2"
            class="h-5 w-5 animate-spin text-muted"
          />
        </div>

        <!-- 已加载全部 -->
        <USeparator
          v-if="!loading && !hasMore && articles.length"
          label="已加载全部"
          class="my-8"
        />

        <!-- 加载失败 -->
        <UAlert
          v-if="error"
          color="error"
          variant="subtle"
          icon="i-lucide-alert-circle"
          title="加载失败"
          :description="error.message"
          class="mt-4"
        />

        <!-- 空状态 -->
        <UAlert
          v-if="!loading && !articles.length && !error"
          color="neutral"
          variant="subtle"
          icon="i-lucide-file-dashed"
          title="暂无文章"
          class="my-20"
        />
      </UPageBody>
    </UPage>
  </UContainer>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { data: sidebarNavData } = useNav('sidebar')
const sidebarItems = computed<NavigationMenuItem[]>(() =>
  transformToNavItems(sidebarNavData.value)
)

const route = useRoute()
const router = useRouter()
const tabItems: { label: string, value: string }[] = [
  { label: '推荐', value: 'recommend' },
  { label: '最新', value: 'newest' }
]
// 默认 "recommend"，避免首次进入无 sort 参数
const active = computed<string>({
  get: () => {
    const s = route.query.sort
    return typeof s === 'string' && s ? s : 'recommend'
  },
  set: tab =>
    router.push({
      path: '/',
      query: { sort: tab === 'recommend' ? undefined : tab }
    })
})

const sort = computed(() =>
  active.value === 'recommend' ? undefined : active.value
)

const { articles, loading, hasMore, error, initialLoad, loadMore, reload }
  = useArticles({ sort })

await initialLoad()

// 切换 Tab 时重新加载（客户端行为）
watch(sort, (newVal, oldVal) => {
  if (newVal !== oldVal) reload()
})

useSeoMeta({
  title: '首页',
  description: '探索全站文章、笔记与文档内容',
  ogTitle: '首页',
  ogDescription: '探索全站文章、笔记与文档内容',
  twitterCard: 'summary_large_image'
})

onMounted(() => {
  useInfiniteScroll(
    document,
    async () => {
      await loadMore()
    },
    {
      distance: 100,
      canLoadMore: () => hasMore.value && !loading.value
    }
  )
})
</script>
