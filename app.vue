<script setup>
useHead({
  title: 'Habits',
  meta: [{ name: 'description', content: 'App description' }],
  htmlAttrs: {
    lang: 'en',
    ['data-theme']: 'lofi',
  },
});
</script>
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
