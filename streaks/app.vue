<script setup>
useHead({
  title: 'App name',
  meta: [
    { name: 'description', content: 'App description' },
  ],
  htmlAttrs: {
    lang: 'en',
    ['data-theme']: 'light'
  }
})

</script>
<template>
    <div>
      <NuxtLayout>
        <NuxtPage/>
      </NuxtLayout>
    </div>
</template>