<script setup lang="ts">
import { onMounted, ref } from 'vue';

const showWarning = ref(false);

onMounted(() => {
  showWarning.value = localStorage.getItem('year-total-rows-informed') !== 'true';
});

const hideWarning = () => {
  localStorage.setItem('year-total-rows-informed', 'true');
  showWarning.value = false;
};
</script>

<template>
  <div
    v-if="showWarning"
    role="alert"
    class="alert fixed bottom-2 right-2 max-w-xl border-2 border-neutral bg-base-300 p-4"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      class="h-6 w-6 shrink-0 stroke-neutral"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
    <span class="text-sm"
      >In the year view, we only show maximum 100 activities for performance reasons. But the total
      duration is shown for <span class="font-bold">all activities</span> in that period.</span
    >
    <div>
      <button class="btn btn-md btn-neutral" @click="hideWarning">I understand</button>
    </div>
  </div>
</template>
