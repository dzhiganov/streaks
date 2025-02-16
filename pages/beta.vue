<script setup>
import { ArrowLeft } from '../assets/icons';

definePageMeta({
  auth: true,
});
</script>

<template>
  <div class="container mx-auto max-w-2xl p-6">
    <NuxtLink to="/" class="btn mb-6">
      <ArrowLeft />
      Back to the main page
    </NuxtLink>
    <h2 class="text-2xl font-bold mb-4">Beta</h2>
    <p class="mb-4">
      This is a beta version of FlowTracks. We are currently working on the main features and will
      release the full version soon.
    </p>
    <p class="mb-4">
      If you have any questions or feedback, please contact us at
      <a href="mailto:support@flow-tracks.com">support@flow-tracks.com</a>.
    </p>
  </div>
</template>
