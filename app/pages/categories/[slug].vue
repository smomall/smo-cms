<template>
  <UContainer>
    <UPage>
      <UPageBody>
        <!-- 分类信息 -->
        <UPageHeader
          v-if="category"
          :title="category.title"
          :description="category.description ?? undefined"
          headline="分类"
          class="mb-6"
        >
          <template #links>
            <UBadge
              v-if="category.articleCount != null"
              color="primary"
              variant="subtle"
              icon="i-lucide-file-text"
              :label="`${category.articleCount} 篇文章`"
            />
          </template>
        </UPageHeader>

        <!-- 加载失败 -->
        <UAlert
          v-else-if="categoryError"
          color="error"
          variant="subtle"
          icon="i-lucide-alert-circle"
          title="加载失败"
          action-text="返回首页"
          to="/"
          class="mt-8"
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
              <div class="flex-1 space-y-2">
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
          v-else-if="category && articles.length"
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
          v-if="!loading && !articles.length && !error && category"
          color="neutral"
          variant="subtle"
          icon="i-lucide-file-dashed"
          title="该分类下暂无文章"
          class="my-20"
        />
      </UPageBody>
    </UPage>
  </UContainer>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = computed(() => getRouteParam(route.params.slug))

const { data: category, error: categoryError } = await useCategoryBySlug(slug)

if (!category?.value || !category.value?.id) {
  throw createError({ status: 404, statusText: '分类不存在' })
}

const categoryId = computed(() => category.value?.id)

const { articles, loading, hasMore, error, initialLoad, loadMore, reload }
  = useArticles({ categoryId })

if (category.value?.id) {
  await initialLoad()
}

watch(categoryId, (newId, oldId) => {
  if (!newId || newId === oldId) return
  reload()
})

useSeoMeta({
  title: () => category.value?.seoTitle || category.value?.title,
  description: () =>
    category.value?.seoDescription || category.value?.description,
  ogTitle: () => category.value?.seoTitle || category.value?.title,
  ogDescription: () =>
    category.value?.seoDescription || category.value?.description,
  ogImage: () => category.value?.cover || undefined,
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
