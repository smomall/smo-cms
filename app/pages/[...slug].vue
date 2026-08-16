<template>
  <UContainer>
    <UPage>
      <UPageBody>
        <!-- 页面基础信息加载中 -->
        <div
          v-if="pagePending"
          class="space-y-4"
        >
          <USkeleton class="h-8 w-3/4" />
          <USkeleton class="h-4 w-1/2" />
          <USkeleton class="h-48 w-full rounded-xl mt-4" />
        </div>

        <!-- 页面加载失败 -->
        <UAlert
          v-else-if="pageError"
          color="error"
          variant="subtle"
          icon="i-lucide-alert-circle"
          title="加载失败"
          action-text="返回首页"
          to="/"
          class="mt-8"
        />

        <!-- 页面已加载 -->
        <template v-else>
          <!-- 单页内容模式 -->
          <template v-if="page?.pageType === 'page'">
            <UPageHeader
              :title="page.title"
              :description="page.description || ''"
              class="mb-8"
            >
              <template #links>
                <UBadge
                  v-if="page.publishAt"
                  color="neutral"
                  variant="subtle"
                  size="sm"
                  icon="i-lucide-calendar"
                  :label="formatDateCN(page.publishAt)"
                />
              </template>
            </UPageHeader>

            <NuxtImg
              v-if="page.cover"
              :src="page.cover"
              :alt="page.title"
              loading="lazy"
              decoding="async"
              referrerpolicy="no-referrer"
              class="mb-8 aspect-[16/9] w-full rounded-xl object-cover"
            />

            <!-- 内容加载中 -->
            <div
              v-if="contentPending"
              class="space-y-2"
            >
              <USkeleton class="h-4 w-full" />
              <USkeleton class="h-4 w-full" />
              <USkeleton class="h-4 w-5/6" />
              <USkeleton class="h-4 w-full" />
              <USkeleton class="h-4 w-4/5" />
              <USkeleton class="h-4 w-full" />
              <USkeleton class="h-4 w-3/4" />
            </div>

            <!-- 内容加载失败 -->
            <UAlert
              v-else-if="contentError"
              color="error"
              variant="subtle"
              icon="i-lucide-alert-circle"
              title="内容加载失败"
              class="mt-4"
            />

            <!-- 正文内容 -->
            <MarkdownRenderer
              v-else-if="!contentPending && content"
              :content="content || ''"
            />
            <UAlert
              v-else
              color="neutral"
              variant="subtle"
              icon="i-lucide-file-x"
              title="暂无内容"
              class="mt-4"
            />
          </template>

          <!-- 列表分页模式 -->
          <template v-else-if="page?.pageType === 'list'">
            <UPageHeader
              :title="page.title"
              :description="page.description || ''"
              class="mb-8"
            />

            <NuxtImg
              v-if="page.cover"
              :src="page.cover"
              :alt="page.title"
              loading="lazy"
              decoding="async"
              referrerpolicy="no-referrer"
              class="mb-8 aspect-[16/9] w-full rounded-xl object-cover"
            />

            <!-- 子页面加载中 -->
            <div
              v-if="childrenPending"
              class="space-y-2"
            >
              <div
                v-for="i in 5"
                :key="i"
                class="rounded-xl border p-4"
              >
                <div class="flex gap-5">
                  <div class="flex-1 space-y-2">
                    <USkeleton class="h-5 w-2/3" />
                    <USkeleton class="h-4 w-full" />
                    <USkeleton class="h-4 w-1/2" />
                  </div>
                  <USkeleton class="h-24 w-36 rounded-lg shrink-0" />
                </div>
              </div>
            </div>

            <!-- 子页面加载失败 -->
            <UAlert
              v-else-if="childrenError"
              color="error"
              variant="subtle"
              icon="i-lucide-alert-circle"
              title="子页面加载失败"
              class="mt-4"
            />

            <!-- 子页面列表 -->
            <template v-else>
              <div
                v-if="childrenData?.records?.length"
                class="space-y-2"
              >
                <UPageCard
                  v-for="child in childrenData.records"
                  :key="child.id"
                  :to="child.path"
                  variant="outline"
                  class="group cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40"
                >
                  <div class="flex gap-5">
                    <div class="flex-1 min-w-0 flex flex-col">
                      <h3
                        class="text-base font-semibold line-clamp-1 group-hover:text-primary transition-colors"
                      >
                        {{ child.title }}
                      </h3>
                      <p
                        v-if="child.description"
                        class="mt-2 text-sm text-muted line-clamp-2 flex-1"
                      >
                        {{ child.description }}
                      </p>
                      <div
                        class="mt-3 flex items-center gap-3 text-xs text-muted"
                      >
                        <span
                          v-if="child.publishAt"
                          class="flex items-center gap-1"
                        >
                          <UIcon
                            name="i-lucide-calendar"
                            class="h-3.5 w-3.5"
                          />
                          {{ formatDateCN(child.publishAt) }}
                        </span>
                      </div>
                    </div>
                    <div
                      class="shrink-0 rounded-lg overflow-hidden bg-elevated/30"
                    >
                      <NuxtImg
                        v-if="child.cover"
                        :src="child.cover"
                        :alt="child.title"
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

              <UAlert
                v-else
                color="neutral"
                variant="subtle"
                icon="i-lucide-folder-x"
                title="暂无子页面"
                class="mt-4"
              />

              <!-- 分页 -->
              <div
                v-if="childrenData"
                class="mt-4 flex justify-center"
              >
                <UPagination
                  v-model="currentPage"
                  :page-count="childrenData.totalPage"
                  size="sm"
                />
              </div>
            </template>
          </template>
        </template>
      </UPageBody>
      <template
        v-if="!contentPending && page?.pageType === 'page'"
        #right
      >
        <UPageAside>
          <MarkdownToc
            :content="content || ''"
          />
        </UPageAside>
      </template>
    </UPage>
  </UContainer>
</template>

<script setup lang="ts">
const route = useRoute()
const path = computed(() => {
  const slug = route.params.slug || []
  const segments = Array.isArray(slug) ? slug : [slug]
  return segments || []
})

// 按路径获取页面基础信息（SSR）
const {
  data: pageData,
  error: pageError,
  pending: pagePending
} = await usePageByPath(path)

if (!pageData.value || !pageData.value?.id) {
  throw createError({ status: 404, statusText: '页面不存在' })
}

const page = computed(() => pageData.value)

// 当前页码（列表模式用）
const currentPage = ref(1)

// 单页模式：正文内容（始终调用 API，仅 pageType==='page' 时渲染）
const {
  data: content,
  error: contentError,
  pending: contentPending
} = usePageContent(() => page.value?.id || '0')

const {
  data: childrenData,
  error: childrenError,
  pending: childrenPending,
  refresh: refreshChildren
} = usePageChildren(
  () => page.value?.id || '0',
  () => currentPage.value
)

watch(currentPage, () => {
  if (page.value?.pageType === 'list') {
    refreshChildren()
  }
})

// SEO
useSeoMeta({
  title: () => page.value?.seoTitle || page.value?.title || '页面',
  description: () => page.value?.seoDescription || page.value?.description,
  ogTitle: () => page.value?.seoTitle || page.value?.title,
  ogDescription: () => page.value?.seoDescription || page.value?.description,
  ogImage: () => page.value?.cover || undefined,
  twitterCard: 'summary_large_image'
})
</script>
