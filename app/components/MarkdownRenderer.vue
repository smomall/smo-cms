<template>
  <div class="markdown text-pretty">
    <!-- <Markdown
      v-if="content"
      :options="{ autoUnwrap: true, autoClose: true }"
      :plugins="plugins"
    >
      {{ content }}
    </Markdown> -->
    <MarkdownDocument
      :tree="tree"
      :options="{ autoUnwrap: true, autoClose: true }"
    />
  </div>
</template>

<script setup lang="ts">
import shiki from '@comark/nuxt/plugins/shiki'
import math, { Math } from '@comark/nuxt/plugins/math'
import 'katex/dist/katex.min.css'

import binding from '@comark/nuxt/plugins/binding'
import breaks from '@comark/nuxt/plugins/breaks'
import emoji from '@comark/nuxt/plugins/emoji'
import footnotes from '@comark/nuxt/plugins/footnotes'
import headings from '@comark/nuxt/plugins/headings'
import punctuation from '@comark/nuxt/plugins/punctuation'
import security from '@comark/nuxt/plugins/security'
import mermaid from 'mermaid'
import githubLight from '@shikijs/themes/github-light'
import githubDark from '@shikijs/themes/github-dark'
import { parseMarkdown } from 'comark'

interface Props {
  content?: string
}

const props = withDefaults(defineProps<Props>(), {
  content: ''
})

const plugins = [
  shiki({
    themes: { light: githubLight, dark: githubDark }
  }),
  math(),
  binding(),
  emoji(),
  breaks(),
  footnotes(),
  headings(),
  punctuation(),
  security()
]

const tree = await parseMarkdown(props.content, {
  plugins: plugins
})

onMounted(async () => {
  mermaid.initialize({ startOnLoad: false })
  await mermaid.run({
    querySelector: '.language-mermaid',
    suppressErrors: true
  })
})
</script>
