<script setup>
const route = useRoute();

useHead({
  title: 'App name',
  meta: [
    { name: 'description', content: 'App description' },
  ],
  htmlAttrs: {
    lang: 'en'
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