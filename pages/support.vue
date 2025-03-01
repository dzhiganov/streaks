<script setup>
import { ArrowLeft } from '../assets/icons';

definePageMeta({
  auth: false,
});
</script>
<template>
  <div class="container mx-auto max-w-2xl p-6">
    <NuxtLink to="/app/dashboard" class="btn mb-6 btn-neutral">
      <ArrowLeft class="w-4 h-4" />
      Back to the app
    </NuxtLink>
    <h2 class="text-2xl font-bold mb-4">Support</h2>

    <div>
      <p class="mt-2">Need help? Reach out to us, and we’ll get back to you as soon as possible.</p>
      <div class="mt-4">
        <p class="font-semibold">Email us:</p>
        <a class="link-primary" href="mailto:support@flow-tracks.com">support@flow-tracks.com</a>
      </div>
    </div>
  </div>
</template>
