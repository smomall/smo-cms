<template>
  <UContainer>
    <!-- 加载中 -->
    <div v-if="notePending" class="flex justify-center py-20">
      <UIcon name="i-lucide-loader-2" class="h-6 w-6 animate-spin text-muted" />
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
      <UPageHeader
        v-if="doc"
        :title="doc.title || ''"
        :description="doc.description || ''"
      >
        <template #headline />
        <template #links />
      </UPageHeader>
      <!-- 右侧：文档内容 -->
      <UPageBody>
        <!-- 文档切换中 -->
        <div v-if="docPending && !doc" class="space-y-4">
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
          <div class="flex flex-wrap justify‑end gap-2 py-2">
            <UBadge
              v-if="doc.wordCount"
              color="neutral"
              variant="subtle"
              size="sm"
              icon="i-lucide-file-text"
              :label="`约 ${doc.wordCount} 字`"
            />
          </div>
          <USeparator />
          <MarkdownRenderer :content="doc.content || ''" />
        </article>
      </UPageBody>
      <template #right>
        <div
          class="hidden overflow-y-auto lg:block lg:max-h-[calc(100vh-var(--ui-header-height))] lg:sticky lg:top-(--ui-header-height) py-8 w-full"
        >
          <MarkdownToc v-if="doc" :content="doc.content || ''" />
        </div>
      </template>
    </UPage>

    <!-- 移动端目录抽屉 -->
    <div
      v-if="note"
      class="fixed right-0 top-1/2 -translate-y-1/2 z-10 md:hidden"
    >
      <div class="flex flex-col gap-2">
        <UDrawer
          direction="right"
          title="章节目录"
          :close="{
            color: 'neutral',
            variant: 'outline',
            class: 'rounded-full',
          }"
        >
          <UButton
            icon="i-lucide-menu"
            color="neutral"
            variant="solid"
            :ui="{
              leadingIcon: 'text-primary',
            }"
            size="md"
            class="font-bold rounded-full"
          >
            章节目录
          </UButton>

          <template #body>
            <div class="min-w-full size-full m-4 overflow-y-auto">
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
            </div>
          </template>
        </UDrawer>
        <UDrawer
          direction="right"
          title="文章目录"
          :close="{
            color: 'neutral',
            variant: 'outline',
            class: 'rounded-full',
          }"
        >
          <UButton
            icon="i-lucide-menu"
            color="neutral"
            variant="solid"
            :ui="{
              leadingIcon: 'text-primary',
            }"
            size="md"
            class="font-bold rounded-full"
          >
            文章目录
          </UButton>

          <template #body>
            <div class="min-w-full size-full m-4 overflow-y-auto">
              <MarkdownToc v-if="doc" :content="doc.content || ''" />
            </div>
          </template>
        </UDrawer>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import type { ChapterDTO } from "~/types";
import type { NavigationMenuItem } from "@nuxt/ui";

const route = useRoute();
const id = computed(() => getRouteParam(route.params.id));
const chapterId = computed(() => getRouteParam(route.params.chapterId));

// 笔记详情 + 章节树（SSR）
const {
  data: note,
  error: noteError,
  pending: notePending,
} = await useNoteDetail(id);

const { data: chapters } = await useNoteChapters(id);
const { data: doc, pending: docPending } = await useChapterDocument(
  id,
  chapterId,
);

// 构建导航树：仅章节链接，默认全部展开
function buildNavItems(): NavigationMenuItem[] {
  function buildChapter(ch: ChapterDTO): NavigationMenuItem {
    const children: NavigationMenuItem[] = [];

    if (ch.children?.length) {
      for (const child of ch.children) {
        children.push(buildChapter(child));
      }
    }

    return {
      label: ch.title,
      to: `/notes/${id.value}/${ch.id}`,
      defaultOpen: true,
      active: chapterId.value === ch.id,
      children: children.length ? children : undefined,
    };
  }

  return (chapters.value ?? []).map(buildChapter);
}

const navItems = computed(() => buildNavItems());

// SEO
useSeoMeta({
  title: () =>
    doc.value?.title
      ? `${doc.value.title} - ${note.value?.title || "笔记"}`
      : note.value?.title || "笔记",
  description: () => doc.value?.description || note.value?.description,
  ogTitle: () => doc.value?.title || note.value?.title,
  ogDescription: () => doc.value?.description || note.value?.description,
  ogImage: () => note.value?.cover,
  twitterCard: "summary_large_image",
});
</script>
