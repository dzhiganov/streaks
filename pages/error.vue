<script setup>
import { CrossIcon } from '../assets/icons';

definePageMeta({
  auth: false,
});

const { query } = useRoute();
const { message } = query;
</script>
<template>
  <div
    class="text-center card mx-auto w-96 shadow-md flex justify-center flex-col gap-4 mt-16 bg-base-200 p-6 items-center"
  >
    <div class="flex flex-col gap-10">
      <div>
        <div class="flex justify-center text-red-300 h-12">
          <CrossIcon />
        </div>
        <div class="text-3xl">{{ message }}</div>
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
