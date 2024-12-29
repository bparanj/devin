<template>
  <UPage>
    <UPageHeader :title="page?.title" :description="page?.description" />
    <UPageBody>
      <ContentRenderer v-if="page" :value="page" />
      <div v-else>Page not found</div>
    </UPageBody>
  </UPage>
</template>

<script setup lang="ts">
const { page } = useContent()

useSeoMeta({
  title: page?.title,
  description: page?.description
})
</script>
