<template>
  <UContainer>
    <UPage>
      <UPageHeader
        headline="搜索"
        description="在全站内容中查找"
      >
        <template #title>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-search"
              class="h-7 w-7 text-primary"
            />
            <span>搜索</span>
          </div>
        </template>
      </UPageHeader>

      <UPageBody>
        <div class="mb-8">
          <UInput
            v-model="keyword"
            placeholder="输入关键词搜索文章..."
            icon="i-lucide-search"
            size="xl"
            @keyup.enter="doSearch"
          >
            <template
              v-if="keyword"
              #trailing
            >
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-x"
                @click="keyword = ''"
              />
            </template>
          </UInput>
          <div class="mt-3 flex justify-end">
            <UButton
              color="primary"
              size="sm"
              icon="i-lucide-search"
              @click="doSearch"
            >
              搜索
            </UButton>
          </div>
        </div>

        <UAlert
          v-if="searched && !results.length"
          color="neutral"
          variant="subtle"
          icon="i-lucide-search-x"
          :title="`未找到与${keyword}相关的内容`"
          class="my-20"
        />

        <UAlert
          v-else-if="!searched"
          color="neutral"
          variant="subtle"
          icon="i-lucide-search"
          title="输入关键词开始搜索"
          class="my-20"
        />

        <div
          v-else
          class="space-y-2"
        >
          <UPageCard
            v-for="item in results"
            :key="item.id"
            :to="`/posts/${item.id}`"
            variant="outline"
            class="group cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40"
          >
            <div class="flex gap-5">
              <div class="flex-1 min-w-0 flex flex-col">
                <h3
                  class="text-base font-semibold line-clamp-1 group-hover:text-primary transition-colors"
                >
                  {{ item.title }}
                </h3>
                <p
                  v-if="item.description"
                  class="mt-2 text-sm text-muted line-clamp-2 flex-1"
                >
                  {{ item.description }}
                </p>
              </div>
            </div>
          </UPageCard>
        </div>
      </UPageBody>
    </UPage>
  </UContainer>
</template>

<script setup lang="ts">
import type { ArticleDTO } from '~/types'

const route = useRoute()

const keyword = ref<string>(
  typeof route.query.q === 'string' ? route.query.q : ''
)
const searched = ref(false)
const results = ref<ArticleDTO[]>([])

function doSearch() {
  const q = keyword.value.trim()
  if (!q) return
  // 同步路由参数，保证刷新可恢复
  navigateTo({ path: '/search', query: { q } }, { replace: true })
  searched.value = true
  results.value = []
  // TODO: 对接后端搜索接口 /cms/articles/search?q=xxx
  // 目前只做 UI 占位
}

// 进入页面时若已有 ?q=xxx 自动搜索
onMounted(() => {
  if (keyword.value) {
    doSearch()
  }
})

useSeoMeta({
  title: () => (keyword.value ? `搜索: ${keyword.value}` : '搜索'),
  description: () => `搜索 ${keyword.value || '全站内容'}`,
  ogTitle: () => (keyword.value ? `搜索: ${keyword.value}` : '搜索'),
  ogDescription: () => `搜索 ${keyword.value || '全站内容'}`,
  twitterCard: 'summary_large_image'
})
</script>
