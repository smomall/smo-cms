<template>
  <UNavigationMenu
    orientation="vertical"
    :items="tocItems"
    default-open="true"
    class="w-full"
  />
</template>

<script setup lang="ts">
import { parseMarkdown } from 'comark'
import headings from '@comark/nuxt/plugins/headings'
import toc from '@comark/nuxt/plugins/toc'
import type { NavigationMenuItem } from '@nuxt/ui'

interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

interface TocTree {
  title: string
  depth: number
  searchDepth: number
  links: TocLink[]
}

interface Props {
  content?: string
  depth?: number
  searchDepth?: number
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
  depth: 5,
  searchDepth: 5
})
const tocData = ref<TocTree>()
const r = await parseMarkdown(props.content || '', {
  plugins: [
    headings(),
    toc({ depth: props.depth, searchDepth: props.searchDepth })
  ]
})
if (r?.meta?.toc) {
  tocData.value = r?.meta?.toc
}

function buildLink(link: TocLink): NavigationMenuItem {
  const children: NavigationMenuItem[] = []

  if (link.children?.length) {
    for (const child of link.children) {
      children.push(buildLink(child))
    }
  }
  return {
    label: link.text,
    to: `#${link.id}`,
    defaultOpen: true,
    children: children.length ? children : []
  }
}

const tocItems = computed<NavigationMenuItem[]>(() => {
  return (tocData.value?.links ?? []).map(buildLink)
})
</script>
