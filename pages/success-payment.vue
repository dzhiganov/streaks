<script setup>
import { CrossIcon } from '../assets/icons';
</script>
<template>
  <div
    class="text-center card mx-auto w-96 shadow-md flex justify-center flex-col gap-4 mt-16 bg-base-200 p-6 items-center"
  >
    <div class="flex flex-col gap-10">
      <div>
        <div class="flex justify-center text-accent h-12">
          <CrossIcon class="w-4 h-4 text-red-300" />
        </div>
        <div class="text-3xl">{{ message }}</div>
      </div>
      <div class="text-center">
        {{ `${numericAmount.data} credits will be added to your account within 10 minutes` }}
      </div>
      <div class="text-sm">
        If you have any questions, please contact us at
        <a class="link-primary" href="mailto:support@anki-cards-generator.cc"
          >support@anki-cards-generator.cc</a
        >
      </div>
      <NuxtLink to="/app" class="btn mb-6 btn-primary">
        <ArrowLeft />
        Back to the app
      </NuxtLink>
    </div>
  </div>
</template>
