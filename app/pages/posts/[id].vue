<template>
  <UContainer>
    <UPage>
      <template #left>
        <div
          class="hidden overflow-y-auto lg:block lg:max-h-[calc(100vh-var(--ui-header-height))] lg:sticky lg:top-(--ui-header-height) py-8 w-full"
        />
      </template>
      <UPageBody>
        <!-- 加载中：骨架屏 -->
        <div
          v-if="articlePending"
          class="space-y-4"
        >
          <USkeleton class="h-8 w-3/4" />
          <USkeleton class="h-4 w-1/2" />
          <div class="flex gap-2 pt-1">
            <USkeleton class="h-5 w-20" />
            <USkeleton class="h-5 w-16" />
            <USkeleton class="h-5 w-16" />
          </div>
          <USkeleton class="h-4 w-full mt-6" />
          <USkeleton class="h-4 w-full" />
          <USkeleton class="h-4 w-5/6" />
          <USkeleton class="h-4 w-full" />
          <USkeleton class="h-4 w-4/5" />
        </div>

        <!-- 加载失败 -->
        <UAlert
          v-else-if="articleError"
          color="error"
          variant="subtle"
          icon="i-lucide-alert-circle"
          title="加载失败"
          action-text="返回首页"
          to="/"
          class="mt-8"
        />

        <!-- 文章不存在 -->
        <UAlert
          v-else-if="!article"
          color="neutral"
          variant="subtle"
          icon="i-lucide-file-x"
          title="文章不存在"
          action-text="返回首页"
          to="/"
          class="mt-8"
        />

        <!-- 文章正文 -->
        <article v-else>
          <!-- 头部信息 -->
          <UPageHeader
            :title="article.title"
            :description="article.description || ''"
            class="mb-8"
          >
            <template #headline>
              <UBadge
                v-if="article.publishAt"
                color="neutral"
                variant="subtle"
                size="sm"
                icon="i-lucide-calendar"
                :label="formatDateCN(article.publishAt)"
              />
            </template>
            <template #links>
              <div class="flex flex-wrap items-center gap-2">
                <UBadge
                  v-if="article.viewCount != null"
                  color="neutral"
                  variant="subtle"
                  size="sm"
                  icon="i-lucide-eye"
                  :label="`${article.viewCount} 阅读`"
                />
                <UBadge
                  v-if="article.likeCount != null"
                  color="neutral"
                  variant="subtle"
                  size="sm"
                  icon="i-lucide-heart"
                  :label="`${article.likeCount}`"
                />
                <UBadge
                  v-if="article.commentCount != null"
                  color="neutral"
                  variant="subtle"
                  size="sm"
                  icon="i-lucide-message-circle"
                  :label="`${article.commentCount}`"
                />
              </div>
            </template>
          </UPageHeader>
          <MarkdownRenderer :content="article.content || ''" />
          <!-- 原文链接 -->
          <UAlert
            v-if="article.source"
            color="neutral"
            variant="subtle"
            icon="i-lucide-external-link"
            :title="article.source"
            class="mt-6"
          >
            <template #description>
              <NuxtLink
                v-if="article.sourceUrl"
                :to="article.sourceUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary underline"
              >
                {{ article.sourceUrl }}
              </NuxtLink>
            </template>
          </UAlert>

          <!-- 分类与标签 -->
          <USeparator
            v-if="article?.category || article?.tags?.length"
            class="mt-10 mb-6"
          />
          <footer
            v-if="article?.category || article?.tags?.length"
            class="space-y-3"
          >
            <div
              v-if="article?.category"
              class="flex items-center gap-2"
            >
              <span class="text-sm text-muted shrink-0">分类：</span>
              <NuxtLink :to="`/categories/${article.category.slug}`">
                <UBadge
                  variant="subtle"
                  color="primary"
                  icon="i-lucide-folder"
                >
                  {{ article.category.title }}
                </UBadge>
              </NuxtLink>
            </div>
            <div
              v-if="article?.tags?.length"
              class="flex items-center gap-2"
            >
              <span class="text-sm text-muted shrink-0">标签：</span>
              <NuxtLink
                v-for="tag in article.tags"
                :key="tag.id"
                :to="`/tags/${tag.slug}`"
              >
                <UBadge
                  variant="subtle"
                  color="neutral"
                  icon="i-lucide-hash"
                >
                  {{ tag.title }}
                </UBadge>
              </NuxtLink>
            </div>
          </footer>
        </article>
      </UPageBody>
      <template #right>
        <div
          class="hidden overflow-y-auto lg:block lg:max-h-[calc(100vh-var(--ui-header-height))] lg:sticky lg:top-(--ui-header-height) py-8 w-full"
        >
          <MarkdownToc
            v-if="article"
            :content="article.content || ''"
          />
        </div>
      </template>
    </UPage>
    <div
      v-if="article"
      class="fixed right-0 top-1/2 -translate-y-1/2 z-10 md:hidden"
    >
      <div class="flex flex-col gap-2">
        <UDrawer
          direction="right"
          title="文章目录"
          :close="{
            color: 'neutral',
            variant: 'outline',
            class: 'rounded-full'
          }"
        >
          <UButton
            icon="i-lucide-menu"
            color="neutral"
            variant="solid"
            :ui="{
              leadingIcon: 'text-primary'
            }"
            size="md"
            class="font-bold rounded-full"
          >
            文章目录
          </UButton>

          <template #body>
            <div class="size-full m-4 overflow-y-auto">
              <MarkdownToc
                v-if="article"
                :content="article.content || ''"
              />
            </div>
          </template>
        </UDrawer>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const route = useRoute()
const id = computed(() => getRouteParam(route.params.id))

// 文章详情（SSR，DTO 已内嵌 category / tags）
const {
  data: article,
  error: articleError,
  pending: articlePending
} = await useArticleDetail(id)

// SEO
useSeoMeta({
  title: () => article.value?.seoTitle || article.value?.title || '文章',
  description: () =>
    article.value?.seoDescription || article.value?.description,
  ogTitle: () => article.value?.seoTitle || article.value?.title,
  ogDescription: () =>
    article.value?.seoDescription || article.value?.description,
  ogImage: () => article.value?.cover,
  ogType: 'article',
  twitterCard: 'summary_large_image'
})
</script>
