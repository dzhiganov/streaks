<script setup>
import Plans from '~/components/Plans.vue';
</script>

<template>
  <div class="px-6 h-auto md:min-h-screen">
    <div class="mx-auto max-w-screen-lg pb-16">
      <header>
        <nav class="flex items-center justify-between gap-20 py-4">
          <ul class="flex gap-16 font-semibold items-center">
            <li>
              <NuxtLink href="#faq">FAQ</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/support">Support</NuxtLink>
            </li>
          </ul>
          <button class="btn btn-neutral w-32" v-if="!isAuthenticated">
            <NuxtLink to="/sign-in">Log in</NuxtLink>
          </button>
        </nav>
      </header>

      <Plans />

      <div class="text-center mt-12 text-sm">
        By proceeding, you agree to the
        <NuxtLink class="link-primary" href="/tos">Terms of Service</NuxtLink> and
        <NuxtLink class="link-primary" href="/privacy-policy">Privacy Notice</NuxtLink>.
      </div>
    </div>
  </div>
</template>
