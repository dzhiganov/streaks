<script setup>
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
              <p class="text-xl text-center">Easy to use, powerfully effective.</p>
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
      <div class="flex justify-center gap-8">
        <div
          class="rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10 relative bg-gray-900 shadow-2xl"
        >
          <h3 id="tier-enterprise" class="text-base/7 font-semibold text-indigo-400">Lifetime</h3>
          <p class="mt-4 flex items-baseline gap-x-2">
            <span class="text-5xl font-semibold tracking-tight text-white">€ 19</span>
            <span class="text-xl text-gray-400">.99</span>
          </p>
          <p class="mt-6 text-base/7 text-gray-300">Lifetime access to the app*</p>
          <ul role="list" class="mt-8 space-y-3 text-sm/6 sm:mt-10 text-gray-300">
            <li class="flex gap-x-3">
              <svg
                class="h-6 w-5 flex-none text-indigo-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Unlimited activities history
            </li>
            <li class="flex gap-x-3">
              <svg
                class="h-6 w-5 flex-none text-indigo-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Unlimited activity types and categories
            </li>
            <li class="flex gap-x-3">
              <svg
                class="h-6 w-5 flex-none text-indigo-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Customization
            </li>
            <li class="flex gap-x-3">
              <svg
                class="h-6 w-5 flex-none text-indigo-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Multiple Visual data representations
            </li>
            <li class="flex gap-x-3">
              <svg
                class="h-6 w-5 flex-none text-indigo-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Customer support
            </li>
            <li class="flex gap-x-3">
              <svg
                class="h-6 w-5 flex-none text-indigo-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Export data to CSV
            </li>
          </ul>
          <a
            href="#"
            aria-describedby="tier-enterprise"
            class="mt-8 block rounded-md py-2.5 px-3.5 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10 bg-indigo-500 text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-indigo-500"
            >Get started today</a
          >
        </div>

        <!-- Secondary card -->
        <div class="rounded-3xl p-8 ring-1 ring-gray-300 sm:p-10 relative bg-white shadow-2xl">
          <h3 id="tier-enterprise" class="text-base font-semibold text-indigo-500">Lifetime</h3>
          <p class="mt-4 flex items-baseline gap-x-2">
            <span class="text-5xl font-semibold tracking-tight text-gray-900">€ 19</span>
            <span class="text-xl text-gray-600">.99</span>
          </p>
          <p class="mt-6 text-base text-gray-700">Lifetime access to the app*</p>
          <ul role="list" class="mt-8 space-y-3 text-sm text-gray-700 sm:mt-10">
            <li class="flex gap-x-3">
              <svg
                class="h-6 w-5 flex-none text-indigo-500"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Unlimited activities history
            </li>
            <li class="flex gap-x-3">
              <svg
                class="h-6 w-5 flex-none text-indigo-500"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Unlimited activity types and categories
            </li>
            <li class="flex gap-x-3">
              <svg
                class="h-6 w-5 flex-none text-indigo-500"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Customization
            </li>
            <li class="flex gap-x-3">
              <svg
                class="h-6 w-5 flex-none text-indigo-500"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Multiple visual data representations
            </li>
            <li class="flex gap-x-3">
              <svg
                class="h-6 w-5 flex-none text-indigo-500"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Customer support
            </li>
            <li class="flex gap-x-3">
              <svg
                class="h-6 w-5 flex-none text-indigo-500"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Export data to CSV
            </li>
          </ul>
          <a
            href="#"
            aria-describedby="tier-enterprise"
            class="mt-8 block rounded-md py-2.5 px-3.5 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10 bg-indigo-500 text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-indigo-500"
          >
            Get started today
          </a>
        </div>
      </div>
    </main>
  </div>

  <footer
    class="mt-20 p-10 text-base-content flex flex-col justify-center items-center gap-8 w-full"
  >
    <div>
      <p>Copyright © {{ new Date().getFullYear() }} - All rights reserved</p>
    </div>
    <div class="flex justify-center w-full gap-12">
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
