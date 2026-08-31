<template>
  <div class="markdown text-pretty">
    <Markdown
      :value="content"
      :options="{ autoUnwrap: true, autoClose: true }"
      :plugins="plugins"
    />
  </div>
</template>

<script setup lang="ts">
import shiki from "@comark/nuxt/plugins/shiki";
import math from "@comark/nuxt/plugins/math";
import "katex/dist/katex.min.css";
import binding from "@comark/nuxt/plugins/binding";
import breaks from "@comark/nuxt/plugins/breaks";
import emoji from "@comark/nuxt/plugins/emoji";
import footnotes from "@comark/nuxt/plugins/footnotes";
import headings from "@comark/nuxt/plugins/headings";
import punctuation from "@comark/nuxt/plugins/punctuation";
import security from "@comark/nuxt/plugins/security";
import mermaid from "mermaid";
import light from "@shikijs/themes/catppuccin-mocha";
// 高亮
import astro from "@shikijs/langs/astro";
import blade from "@shikijs/langs/blade";
import c from "@shikijs/langs/c";
import coffeescript from "@shikijs/langs/coffeescript";
import cpp from "@shikijs/langs/cpp";
import css from "@shikijs/langs/css";
import glsl from "@shikijs/langs/glsl";
import graphql from "@shikijs/langs/graphql";
import haml from "@shikijs/langs/haml";
import handlebars from "@shikijs/langs/handlebars";
import html from "@shikijs/langs/html";
import http from "@shikijs/langs/http";
import imba from "@shikijs/langs/imba";
import java from "@shikijs/langs/java";
import javascript from "@shikijs/langs/javascript";
import jinja from "@shikijs/langs/jinja";
import jison from "@shikijs/langs/jison";
import json from "@shikijs/langs/json";
import json5 from "@shikijs/langs/json5";
import jsonc from "@shikijs/langs/jsonc";
import jsonl from "@shikijs/langs/jsonl";
import jsx from "@shikijs/langs/jsx";
import julia from "@shikijs/langs/julia";
import less from "@shikijs/langs/less";
import lua from "@shikijs/langs/lua";
import markdown from "@shikijs/langs/markdown";
import marko from "@shikijs/langs/marko";
import mdc from "@shikijs/langs/mdc";
import mdx from "@shikijs/langs/mdx";
import php from "@shikijs/langs/php";
import postcss from "@shikijs/langs/postcss";
import pug from "@shikijs/langs/pug";
import python from "@shikijs/langs/python";
import r from "@shikijs/langs/r";
import ruby from "@shikijs/langs/ruby";
import sass from "@shikijs/langs/sass";
import scss from "@shikijs/langs/scss";
import shell from "@shikijs/langs/shell";
import sql from "@shikijs/langs/sql";
import stylus from "@shikijs/langs/stylus";
import svelte from "@shikijs/langs/svelte";
import toml from "@shikijs/langs/toml";
import tsx from "@shikijs/langs/tsx";
import typescript from "@shikijs/langs/typescript";
import vue from "@shikijs/langs/vue";
import vueHtml from "@shikijs/langs/vue-html";
import wasm from "@shikijs/langs/wasm";
import wgsl from "@shikijs/langs/wgsl";
import xml from "@shikijs/langs/xml";
import yaml from "@shikijs/langs/yaml";

const langs = [
  astro,
  blade,
  c,
  coffeescript,
  cpp,
  css,
  glsl,
  graphql,
  haml,
  handlebars,
  html,
  http,
  imba,
  java,
  javascript,
  jinja,
  jison,
  json,
  json5,
  jsonc,
  jsonl,
  jsx,
  julia,
  less,
  lua,
  markdown,
  marko,
  mdc,
  mdx,
  php,
  postcss,
  pug,
  python,
  r,
  ruby,
  sass,
  scss,
  shell,
  sql,
  stylus,
  svelte,
  toml,
  tsx,
  typescript,
  vue,
  vueHtml,
  wasm,
  wgsl,
  xml,
  yaml,
];

interface Props {
  content?: string;
}

withDefaults(defineProps<Props>(), {
  content: "",
});
const plugins = [
  shiki({
    preStyles: true,
    languages: [...langs],
    themes: {
      light: light,
      // dark: dark
    },
  }),
  math(),
  binding(),
  emoji(),
  breaks(),
  footnotes(),
  headings(),
  punctuation(),
  security(),
];

onMounted(async () => {
  mermaid.initialize({ startOnLoad: false });
  await mermaid.run({
    querySelector: ".language-mermaid",
    suppressErrors: true,
  });
});
</script>
<style scoped>
.markdown h1,
.markdown h2,
.markdown h3,
.markdown h4,
.markdown h5,
.markdown h6 {
  /* 长无空格标识符自动换行 */
  overflow-wrap: break-word;
  /* 标题均衡换行排版 */
  text-wrap: balance;
  /* flex父容器换行兜底修复 */
  min-width: 0;
}
</style>
