<template>
  <transition name="fade-slide" mode="out-in">
    <div
      v-if="show"
      class="bg-yellow-100 text-yellow-800 p-3 rounded-md flex justify-center items-center mb-6"
    >
      <slot />
    </div>
  </transition>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
});
</script>

<style>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
