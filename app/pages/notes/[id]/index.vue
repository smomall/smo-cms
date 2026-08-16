<template>
  <UContainer>
    <UPage>
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

      <!-- 封面页 -->
      <template v-else>
        <UPageHeader
          :title="note.title"
          :description="note.description ?? undefined"
          headline="笔记"
          :links="headerLinks"
        />

        <UPageBody>
          <!-- 统计信息 -->
          <div class="flex flex-wrap items-center gap-3 mb-8">
            <UBadge
              :label="`${totalChapterCount} 章节`"
              color="primary"
              variant="subtle"
              icon="i-lucide-list-tree"
            />
            <UBadge
              v-if="note.publishAt"
              :label="formatDateCN(note.publishAt)"
              color="neutral"
              variant="subtle"
              icon="i-lucide-calendar"
            />
            <UBadge
              v-if="note.cover"
              label="有封面"
              color="neutral"
              variant="subtle"
              icon="i-lucide-image"
            />
          </div>

          <!-- 目录 -->
          <UPageCard
            v-if="chaptersError"
            variant="outline"
          >
            <UAlert
              color="error"
              variant="subtle"
              icon="i-lucide-alert-circle"
              title="章节加载失败"
              class="m-4"
            />
          </UPageCard>

          <UPageCard
            v-else-if="chapters?.length"
            variant="outline"
            :ui="{ body: 'p-0 sm:p-0' }"
          >
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-list"
                  class="h-5 w-5 text-primary"
                />
                <h2 class="text-lg font-semibold">
                  目录
                </h2>
                <UBadge
                  :label="`${totalChapterCount} 章`"
                  color="neutral"
                  variant="subtle"
                  size="sm"
                  class="ml-auto"
                />
              </div>
            </template>

            <UNavigationMenu
              orientation="vertical"
              :items="navItems"
              highlight
              highlight-color="primary"
              class="w-full px-4 py-2"
            />

            <template #footer>
              <div class="flex justify-center">
                <UButton
                  :to="`/notes/${note.id}/${firstChapterId}`"
                  color="primary"
                  variant="link"
                  icon="i-lucide-book-open"
                  size="lg"
                >
                  进入阅读
                </UButton>
              </div>
            </template>
          </UPageCard>

          <!-- 无章节 -->
          <UAlert
            v-else
            color="neutral"
            variant="subtle"
            icon="i-lucide-folder-x"
            title="暂无章节"
            description="该笔记尚未创建章节内容"
            class="mt-4"
          />
        </UPageBody>
      </template>
    </UPage>
  </UContainer>
</template>

<script setup lang="ts">
import type { ChapterDTO } from '~/types'
import type { ButtonProps, NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const id = computed(() => getRouteParam(route.params.id))

// 笔记详情 + 章节树（SSR）
const {
  data: note,
  error: noteError,
  pending: notePending
} = await useNoteDetail(id)

const { data: chapters, error: chaptersError } = await useNoteChapters(id)

// 深度优先查找第一个叶子章节
function findFirstChapter(list: ChapterDTO[]): ChapterDTO | null {
  if (!list?.length) return null
  const first = list[0]
  if (!first) return null
  if (first.children?.length) return findFirstChapter(first.children) ?? first
  return first
}

const firstChapterId = computed(
  () => findFirstChapter(chapters.value ?? [])?.id ?? '0'
)

// UPageHeader links（无章节时不显示"开始阅读"）
const headerLinks = computed<ButtonProps[]>(() => {
  const links: ButtonProps[] = [
    {
      label: '返回列表',
      icon: 'i-lucide-arrow-left',
      to: '/notes',
      color: 'neutral',
      variant: 'ghost',
      size: 'xl'
    }
  ]
  if (chapters.value?.length) {
    links.unshift({
      label: '开始阅读',
      icon: 'i-lucide-book-open',
      to: `/notes/${id.value}/${firstChapterId.value}`,
      size: 'xl'
    })
  }
  return links
})

// 递归统计总章节数
const totalChapterCount = computed(() => {
  let count = 0
  function countChapters(list: ChapterDTO[]) {
    for (const ch of list) {
      count++
      if (ch.children?.length) countChapters(ch.children)
    }
  }
  countChapters(chapters.value ?? [])
  return count
})

// 构建导航树
const navItems = computed<NavigationMenuItem[]>(() => {
  function buildChapter(ch: ChapterDTO): NavigationMenuItem {
    const children: NavigationMenuItem[] = []
    if (ch.children?.length) {
      for (const child of ch.children) {
        children.push(buildChapter(child))
      }
    }
    return {
      label: ch.title,
      icon: ch.children?.length ? 'i-lucide-folder' : 'i-lucide-file-text',
      to: `/notes/${id.value}/${ch.id}`,
      children: children.length ? children : undefined,
      defaultOpen: true
    }
  }
  return (chapters.value ?? []).map(buildChapter)
})

// SEO
useSeoMeta({
  title: () => note.value?.title || '笔记',
  description: () => note.value?.description,
  ogTitle: () => note.value?.title,
  ogDescription: () => note.value?.description,
  ogImage: () => note.value?.cover,
  twitterCard: 'summary_large_image'
})
</script>
