<script setup>
import Plans from '~/components/Plans.vue';
import { ArrowRightCircle } from '../assets/icons';

definePageMeta({
  middleware: ['auth'],
});

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/app',
  },
});
</script>
<template>
  <div>
    <div class="px-6 h-auto md:min-h-screen">
      <div class="mx-auto max-w-screen-lg pb-16">
        <header>
          <nav class="flex items-center justify-between gap-20 py-4">
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
            <button class="btn btn-neutral w-32">
              <NuxtLink to="/sign-in">Log in</NuxtLink>
            </button>
          </nav>

          <div class="mt-24">
            <div class="flex flex-col gap-4 items-center">
              <h1 class="text-6xl font-semibold text-center">
                Record your work, analyze your progress
              </h1>
              <p class="text-xl text-center">Simple and super powerful</p>
              <button class="btn btn-primary w-48 flex items-center gap-2">
                <span>Start for free</span>
                <ArrowRightCircle />
              </button>
            </div>

            <div
              class="mockup-window border border-neutral-400 mt-12 rounded-3xl ring-1 ring-gray-900/10 shadow-2xl"
            >
              <div class="border-base-300 flex justify-top border-t px-4">
                <NuxtImg src="/promo-table.jpeg" alt="promo image" />
              </div>
            </div>
          </div>
        </header>
      </div>
    </div>
    <main>
      <Plans />
    </main>
  </div>

  <footer
    class="mt-20 p-10 text-base-content flex flex-col justify-center items-center gap-8 w-full border-t border-gray-300"
  >
    <div>
      <p>Copyright © {{ new Date().getFullYear() }} - All rights reserved</p>
    </div>
    <div class="flex justify-between w-full gap-12">
      <div>
        <div class="flex items-center gap-2">
          <NuxtImg src="/favicon.svg" alt="Habits" class="w-8 h-8" />
          <h1 class="text-2xl font-bold font-header">Habits</h1>
        </div>
      </div>
      <div class="flex justify-end w-full gap-16">
        <div>
          <div class="font-semibold text-lg mb-2">Links</div>
          <ul class="list flex flex-col gap-2">
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
      </div>
      <div>
        <div class="font-semibold text-lg mb-2">Legal</div>
        <ul class="list flex flex-col gap-2">
          <li>
            <NuxtLink to="/tos">Terms</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/privacy-policy">Privacy</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
