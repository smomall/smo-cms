<template>
  <UContainer>
    <UPage>
      <UPageHeader
        description="技术笔记与知识库"
        headline="学习资源"
      >
        <template #title>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-library"
              class="h-7 w-7 text-primary"
            />
            <span>笔记</span>
          </div>
        </template>
      </UPageHeader>

      <UPageBody>
        <!-- 加载中：骨架屏 -->
        <div
          v-if="loading && !notes.length"
          class="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
        >
          <UPageCard
            v-for="i in 12"
            :key="i"
            variant="outline"
            class="overflow-hidden"
          >
            <template #header>
              <USkeleton class="aspect-[3/4] rounded-none" />
            </template>
            <div class="space-y-2">
              <USkeleton class="h-4 w-3/4" />
              <USkeleton class="h-3 w-full" />
              <USkeleton class="h-3 w-1/2" />
            </div>
          </UPageCard>
        </div>

        <!-- 笔记网格 -->
        <div
          v-else-if="notes.length"
          class="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
        >
          <UPageCard
            v-for="note in notes"
            :key="note.id"
            :to="`/notes/${note.id}`"
            variant="outline"
            spotlight
            spotlight-color="primary"
            class="group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <template #header>
              <div class="aspect-[3/4] overflow-hidden bg-elevated/30">
                <NuxtImg
                  v-if="note.cover"
                  :src="note.cover"
                  :alt="note.title"
                  loading="lazy"
                  decoding="async"
                  referrerpolicy="no-referrer"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-default/50 to-elevated/40"
                >
                  <UIcon
                    name="i-lucide-book-open"
                    class="h-10 w-10 text-primary/30 transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </div>
            </template>

            <h3
              class="font-semibold text-sm text-highlighted line-clamp-1 group-hover:text-primary transition-colors"
            >
              {{ note.title }}
            </h3>
            <p
              v-if="note.description"
              class="mt-1 text-xs text-muted line-clamp-2"
            >
              {{ note.description }}
            </p>

            <template #footer>
              <div class="flex items-center justify-between w-full gap-2">
                <UBadge
                  label="笔记"
                  color="primary"
                  variant="subtle"
                  size="sm"
                />
                <span
                  v-if="note.publishAt"
                  class="text-xs text-muted flex items-center gap-1"
                >
                  {{ formatDateShort(note.publishAt) }}
                </span>
              </div>
            </template>
          </UPageCard>
        </div>

        <!-- 加载更多 -->
        <div
          v-if="loading && notes.length"
          class="flex justify-center py-8"
        >
          <UIcon
            name="i-lucide-loader-2"
            class="h-5 w-5 animate-spin text-muted"
          />
        </div>

        <!-- 已加载全部 -->
        <USeparator
          v-if="!loading && !hasMore && notes.length"
          label="已加载全部"
          class="my-8"
        />

        <!-- 错误 -->
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
          v-if="!loading && !notes.length && !error"
          color="neutral"
          variant="subtle"
          icon="i-lucide-book-dashed"
          title="暂无笔记"
          class="my-20"
        />
      </UPageBody>
    </UPage>
  </UContainer>
</template>

<script setup lang="ts">
const { notes, loading, hasMore, error, initialLoad, loadMore } = useNotes()

await initialLoad()

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
