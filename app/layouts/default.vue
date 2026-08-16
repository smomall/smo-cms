<template>
  <UApp :locale="zh_cn">
    <UHeader>
      <template #left>
        <NuxtLink to="/"> SMO-CMS </NuxtLink>
      </template>
      <UNavigationMenu :items="headerItems" />
      <template #right>
        <UColorModeButton />
      </template>
    </UHeader>
    <UMain>
      <slot />
    </UMain>
  </UApp>
</template>

<script setup lang="ts">
import { zh_cn } from '@nuxt/ui/locale'
import type { NavigationMenuItem } from '@nuxt/ui'

const { data: headerNavData } = useNav('header')

const headerItems = computed<NavigationMenuItem[]>(() =>
  transformToNavItems(headerNavData.value)
)
</script>
