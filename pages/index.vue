<script setup>
import { ArrowRight } from '../assets/icons';

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
  <div data-theme="light">
    <div class="px-6 h-auto md:min-h-screen" data-testid="home-page">
      <div class="mx-auto max-w-screen-lg pb-16">
        <header>
          <nav class="flex items-center justify-between gap-20 py-4">
            <div class="flex items-center gap-2">
              <NuxtImg src="/favicon.svg" alt="FlowTracks" class="w-8 h-8" />
              <h1 class="text-2xl font-bold font-header">FlowTracks</h1>
            </div>
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
            <NuxtLink to="/sign-in" class="btn btn-neutral w-32">Log in</NuxtLink>
          </nav>

          <div class="mt-24">
            <div class="flex flex-col gap-4 items-center">
              <h1 class="text-6xl font-semibold text-center text-gray-800 max-w-2xl">
                Record your work, analyze your
                <span
                  class="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent"
                  >progress</span
                >
              </h1>
              <p class="text-xl text-center">Simple and <span>super powerful</span></p>

              <NuxtLink
                to="/sign-in"
                class="btn btn-neutral w-48 flex items-center gap-2 btn-lg hover:scale-105"
              >
                Start for free
                <ArrowRight class="w-4 h-4" />
              </NuxtLink>
            </div>

            <div class="mt-12 shadow-2xl">
              <div class="flex justify-top">
                <NuxtImg src="/promo-images/main-promo.png" alt="promo image" class="w-full" />
              </div>
            </div>
          </div>
        </header>
      </div>
    </div>

    <section class="max-w-5xl mx-auto px-6 my-24">
      <div class="flex flex-col md:flex-row gap-12 mb-24">
        <div class="md:w-1/2">
          <h2 class="text-3xl font-semibold mb-4">Visualize Your Productivity</h2>
          <p class="text-lg text-gray-600">
            Get a detailed graph of your activities to see where your time goes. Identify trends,
            optimize your workflow, and make data-driven decisions to improve productivity.
          </p>
        </div>
        <div class="md:w-1/2">
          <NuxtImg src="/promo-images/graph-1.png" alt="Graph with Activities" />
        </div>
      </div>

      <div class="divider divider-horizontal my-24" />

      <div class="flex flex-col md:flex-row-reverse gap-12 mb-24">
        <div class="md:w-1/2">
          <h2 class="text-3xl font-semibold mb-4">Stay on Track with Goals</h2>
          <p class="text-lg text-gray-600">
            Set and track your daily, weekly, and monthly goals effortlessly. Stay accountable and
            maintain consistency with an intuitive goal tracking system.
          </p>
        </div>
        <div class="md:w-1/2">
          <NuxtImg src="/promo-images/goals-1.png" alt="Tracking Goals" />
        </div>
      </div>

      <div class="divider divider-horizontal my-24" />

      <div class="flex flex-col md:flex-row gap-12">
        <div class="md:w-1/2">
          <h2 class="text-3xl font-semibold mb-4">Generate Reports with Ease</h2>
          <p class="text-lg text-gray-600">
            Need a summary of your progress? Our report generation feature provides an insightful
            breakdown of your tracked activities over any selected date range.
          </p>
        </div>
        <div class="md:w-1/2">
          <NuxtImg src="/promo-images/report-1.png" alt="Generate Reports" />
        </div>
      </div>
    </section>

    <section class="py-16 text-center">
      <div>
        <h2 class="text-3xl font-bold mb-10">3 Steps to Achieve Your Goals</h2>
        <div class="w-full py-12">
          <div class="max-w-5xl mx-auto flex gap-8">
            <div class="card bg-base-100 w-96 mx-auto rounded-xl shadow-lg">
              <figure>
                <img src="/step-1.png" alt="Set Goals" />
              </figure>
              <div class="card-body flex items-center rounded-xl shadow-lg">
                <h2 class="card-title">🎯 Set Your Goals</h2>
                <p class="text-lg">Define what you want to accomplish.</p>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="card bg-base-100 w-96 mx-auto rounded-xl shadow-lg">
              <figure>
                <img src="/step-2.png" alt="Track Progress" />
              </figure>
              <div class="card-body flex items-center rounded-xl shadow-lg">
                <h2 class="card-title">⏳ Track Your Progress</h2>
                <p class="text-lg">Log your activities and stay on track.</p>
              </div>
            </div>

            <!-- Step 3 -->
            <div class="card bg-base-100 w-96 mx-auto rounded-xl shadow-lg">
              <figure>
                <img src="/step-3.png" alt="Reach Goals" />
              </figure>
              <div class="card-body flex items-center rounded-xl shadow-lg">
                <h2 class="card-title">🏆 Reach Your Goals</h2>
                <p class="text-lg">See your progress and celebrate success!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-12 flex justify-center">
        <NuxtLink
          to="/sign-in"
          class="btn btn-primary w-fit flex items-center gap-2 hover:scale-105"
        >
          Start 14-day trial now
          <ArrowRight class="w-4 h-4" />
        </NuxtLink>
      </div>
    </section>

    <footer
      class="mt-20 p-10 text-base-content flex flex-col justify-center items-center gap-8 w-full border-t border-gray-300 mt-24 max-w-5xl mx-auto"
    >
      <div>
        <p>Copyright © {{ new Date().getFullYear() }} - All rights reserved</p>
      </div>
      <div class="flex justify-between w-full gap-12">
        <div>
          <div class="flex items-center gap-2">
            <NuxtImg src="/favicon.svg" alt="FlowTracks" class="w-8 h-8" />
            <h1 class="text-2xl font-bold font-header">FlowTracks</h1>
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
  </div>
</template>
