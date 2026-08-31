<template>
  <UNavigationMenu
    highlight
    highlight-color="primary"
    orientation="vertical"
    :items="tocItems"
    default-open="true"
    class="w-full relative"
  />
</template>

<script setup lang="ts">
import { parseMarkdown } from 'comark'
import headings from '@comark/nuxt/plugins/headings'
import toc, { type TocLink } from '@comark/nuxt/plugins/toc'
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

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

const result = await parseMarkdown(props.content || '', {
  plugins: [
    headings(),
    toc({ depth: props.depth, searchDepth: props.searchDepth })
  ]
})

function buildLink(link: TocLink, hash?: string): NavigationMenuItem {
  const children: NavigationMenuItem[] = []
  if (link.children?.length) {
    for (const child of link.children) {
      children.push(buildLink(child, hash))
    }
  }
  return {
    label: link.text,
    to: `#${link.id}`,
    active: link.id === (hash || ''),
    defaultOpen: true,
    children: children || []
  }
}

const tocItems = computed<NavigationMenuItem[]>(() => {
  const currentHash = route.hash
  return (result?.meta?.toc?.links ?? []).map(item =>
    buildLink(item, currentHash)
  )
})
</script>
