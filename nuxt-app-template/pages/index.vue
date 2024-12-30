<script setup>
definePageMeta({
  middleware: ["auth"],
});

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/app",
  },
});
</script>
<template>
  <div>
    <div class="px-6 h-auto md:min-h-screen">
      <div class="mx-auto max-w-screen-lg pb-16">
        <header class="flex items-center gap-20 py-4">
          <nav class="hidden md:block">
            <ul class="flex gap-16 font-semibold">
              <li>
                <NuxtLink href="#faq">FAQ</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/support">Support</NuxtLink>
              </li>
              <li>
                <NuxtLink href="#pricing">Pricing</NuxtLink>
              </li>
            </ul>
          </nav>
          <button class="btn ms-auto text-white w-32 bg-ghost">
            <NuxtLink to="/sign-in"> Log in </NuxtLink>
          </button>
        </header>
      </div>
    </div>
    <main></main>
  </div>

  <footer
    class="bg-gray-900 p-10 text-base-content flex flex-col justify-center items-center gap-8 w-full"
  >
    <div>
      <p class="secondary-text">
        Copyright © {{ new Date().getFullYear() }} - All rights reserved
      </p>
    </div>
    <div class="columns">
      <div>
        <div class="font-semibold text-lg mb-2">Links</div>
        <ul class="list">
          <li>
            <NuxtLink to="/sign-in">Login</NuxtLink>
          </li>
          <li>
            <a href="#faq">FAQ</a>
          </li>
          <li>
            <NuxtLink to="/support">Support</NuxtLink>
          </li>
          <li>
            <a href="#pricing">Pricing</a>
          </li>
        </ul>
      </div>
      <div>
        <div class="font-semibold text-lg mb-2">Legal</div>
        <ul class="list">
          <li>
            <NuxtLink to="/tos"> Terms and Conditions </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/privacy-policy"> Privacy policy </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
