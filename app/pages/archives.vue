<template>
  <UContainer>
    <UPage>
      <UPageHeader
        headline="归档"
        description="按时间浏览全部文章"
      >
        <template #title>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-archive"
              class="h-7 w-7 text-primary"
            />
            <span>归档</span>
          </div>
        </template>
      </UPageHeader>

      <UPageBody>
        <div class="flex flex-col items-center py-20 text-center text-muted">
          <UIcon
            name="i-lucide-archive-restore"
            class="h-16 w-16 mb-4 opacity-30"
          />
          <p class="text-sm">
            归档功能开发中...
          </p>
        </div>
      </UPageBody>
    </UPage>
  </UContainer>
</template>

<script setup lang="ts">
useSeoMeta({
  title: '归档',
  description: '按时间线浏览全部文章归档',
  ogTitle: '归档',
  ogDescription: '按时间线浏览全部文章归档',
  twitterCard: 'summary_large_image'
})
</script>
