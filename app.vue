<template>
  <UContainer>
    <UHeader>
      <template #left>
        <h1 class="font-bold text-xl">Documentation</h1>
      </template>
    </UHeader>
    <UDocsPageLayout>
      <template #left>
        <UDocsSidebarNav :links="navigation" />
      </template>
      <NuxtPage />
      <template #right>
        <UDocsToc />
      </template>
    </UDocsPageLayout>
  </UContainer>
</template>

<script setup lang="ts">
import { useContent } from '#imports'

const { navigation } = useContent()
</script>

<style>
body {
  @apply bg-gray-50 dark:bg-gray-950;
}
</style>
