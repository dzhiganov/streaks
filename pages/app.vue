<script setup>
definePageMeta({
  auth: {
    unauthenticatedOnly: false,
    navigateUnauthenticatedTo: '/'
  }
})

</script>

<template>
  <header>
    Streaks
  </header>
  <aside>
    <nav>
      <ul>
        <li>
          <NuxtLink to="/app/home">Activities</NuxtLink>
        </li>
      </ul>
    </nav>
  </aside>
  <main>
    <NuxtPage />
  </main>
</template>
