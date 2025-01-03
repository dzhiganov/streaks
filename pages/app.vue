<script setup>
definePageMeta({
  auth: {
    unauthenticatedOnly: false,
    navigateUnauthenticatedTo: '/'
  }
})

const route = useRoute();

const isActive = (path) => route.path === path;

const navLinks = [
  { title: 'Activities', path: '/app/home' },
  { title: 'Statistics', path: '/app/stats' },
  { title: 'Settings', path: '/app/settings' },
]
</script>

<template>
  <div class="grid grid-rows-[auto_1fr] grid-cols-[250px_1fr] min-h-screen">
    <header class="flex justify-between bg-gray-800 text-white p-4 col-span-2">
      Streaks
    </header>
    <aside class="bg-gray-200 p-4">
    <nav>
      <ul>
        <li v-for="link in navLinks" :key="link.path">
          <NuxtLink :to="link.path" :class="{ 'text-blue-500': isActive(link.path) }">
            {{ link.title }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </aside>
  <main class="bg-white p-4 overflow-auto">
    <NuxtPage />
  </main>
  </div>
</template>
