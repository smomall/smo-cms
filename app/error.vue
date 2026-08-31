<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()
</script>

<template>
  <UPage>
    <UPageBody>
      <UError :error="error" />
    </UPageBody>
  </UPage>
</template>
