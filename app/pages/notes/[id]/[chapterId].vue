<template>
  <div class="chapter">
    <!-- 加载中 -->
    <div
      v-if="notePending"
      class="flex justify-center py-20"
    >
      <UIcon
        name="i-lucide-loader-2"
        class="h-6 w-6 animate-spin text-muted"
      />
    </div>

    <!-- 加载失败 -->
    <UAlert
      v-else-if="noteError"
      color="error"
      variant="subtle"
      icon="i-lucide-alert-circle"
      title="加载失败"
      action-text="返回笔记列表"
      to="/notes"
      class="mt-8"
    />

    <!-- 笔记不存在 -->
    <UAlert
      v-else-if="!note"
      color="neutral"
      variant="subtle"
      icon="i-lucide-book-x"
      title="笔记不存在"
      action-text="返回笔记列表"
      to="/notes"
      class="mt-8"
    />

    <!-- 阅读页 -->
    <UPage v-else>
      <!-- 左侧：章节目录（桌面端） -->
      <template #left>
        <UPageAside>
          <UButton
            :to="`/notes/${id}`"
            variant="ghost"
            color="neutral"
            size="sm"
            icon="i-lucide-arrow-left"
            class="mb-3"
          >
            {{ note.title }}
          </UButton>

          <UAlert
            v-if="!chapters?.length"
            color="neutral"
            variant="subtle"
            icon="i-lucide-folder-x"
            title="暂无章节"
            class="mx-1"
          />

          <UNavigationMenu
            v-else
            orientation="vertical"
            :items="navItems"
            highlight
            highlight-color="primary"
            class="w-full"
          />
        </UPageAside>
      </template>

      <!-- 右侧：文档内容 -->
      <UPageBody>
        <!-- 移动端目录按钮 -->
        <UButton
          variant="outline"
          color="neutral"
          icon="i-lucide-list"
          class="lg:hidden mb-4"
          @click="slideoverOpen = true"
        >
          目录
        </UButton>

        <!-- 文档切换中 -->
        <div
          v-if="docPending && !doc"
          class="space-y-4"
        >
          <USkeleton class="h-4 w-32" />
          <USkeleton class="h-8 w-3/4" />
          <USkeleton class="h-4 w-full" />
          <USkeleton class="h-4 w-5/6" />
        </div>

        <!-- 无文档内容 -->
        <UAlert
          v-else-if="!doc"
          color="neutral"
          variant="subtle"
          icon="i-lucide-file-x"
          title="该章节暂无内容"
          class="mt-4"
        />

        <!-- 文档正文 -->
        <article v-else>
          <header class="mb-6 pb-4 border-b border-default">
            <h1 class="text-2xl font-bold tracking-tight">
              {{ doc.title }}
            </h1>
            <p
              v-if="doc.description"
              class="mt-2 text-sm text-muted"
            >
              {{ doc.description }}
            </p>
            <div class="mt-3 flex items-center gap-2">
              <UBadge
                v-if="doc.wordCount"
                color="neutral"
                variant="subtle"
                size="sm"
                icon="i-lucide-file-text"
                :label="`约 ${doc.wordCount} 字`"
              />
            </div>
          </header>
          <MarkdownRenderer :content="doc.content || ''" />
        </article>
      </UPageBody>
      <template #right>
        <div
          class="hidden overflow-y-auto lg:block lg:max-h-[calc(100vh-var(--ui-header-height))] lg:sticky lg:top-(--ui-header-height) w-full"
        >
          <MarkdownToc
            v-if="doc"
            :content="doc.content || ''"
          />
        </div>
      </template>
    </UPage>

    <!-- 移动端目录抽屉 -->
    <USlideover
      v-if="note"
      v-model:open="slideoverOpen"
      title="目录"
      :ui="{ content: 'w-80' }"
    >
      <template #body>
        <UButton
          :to="`/notes/${id}`"
          variant="ghost"
          color="neutral"
          size="sm"
          icon="i-lucide-arrow-left"
          class="mb-3"
        >
          {{ note?.title }}
        </UButton>

        <UAlert
          v-if="!chapters?.length"
          color="neutral"
          variant="subtle"
          icon="i-lucide-folder-x"
          title="暂无章节"
        />

        <UNavigationMenu
          v-else
          orientation="vertical"
          :items="navItems"
          default-open
          highlight
          highlight-color="primary"
          class="w-full"
        />
      </template>
    </USlideover>
  </div>
</template>

<script setup lang="ts">
import type { ChapterDTO } from '~/types'
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const id = computed(() => getRouteParam(route.params.id))
const chapterId = computed(() => getRouteParam(route.params.chapterId))

// 笔记详情 + 章节树（SSR）
const {
  data: note,
  error: noteError,
  pending: notePending
} = await useNoteDetail(id)

const { data: chapters } = await useNoteChapters(id)
const { data: doc, pending: docPending } = await useChapterDocument(
  id,
  chapterId
)

const slideoverOpen = ref(false)

// 构建导航树：仅章节链接，默认全部展开
function buildNavItems(): NavigationMenuItem[] {
  function buildChapter(ch: ChapterDTO): NavigationMenuItem {
    const children: NavigationMenuItem[] = []

    if (ch.children?.length) {
      for (const child of ch.children) {
        children.push(buildChapter(child))
      }
    }

    return {
      label: ch.title,
      to: `/notes/${id.value}/${ch.id}`,
      defaultOpen: true,
      active: chapterId.value === ch.id,
      children: children.length ? children : undefined
    }
  }

  return (chapters.value ?? []).map(buildChapter)
}

const navItems = computed(() => buildNavItems())

// SEO
useSeoMeta({
  title: () =>
    doc.value?.title
      ? `${doc.value.title} - ${note.value?.title || '笔记'}`
      : note.value?.title || '笔记',
  description: () => doc.value?.description || note.value?.description,
  ogTitle: () => doc.value?.title || note.value?.title,
  ogDescription: () => doc.value?.description || note.value?.description,
  ogImage: () => note.value?.cover,
  twitterCard: 'summary_large_image'
})
</script>
