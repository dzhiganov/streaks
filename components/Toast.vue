<script setup>
import { computed, ref, watchEffect } from 'vue';
import { AlertIcon, CheckCircleIcon } from '~/assets/icons';

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  show: {
    type: Boolean,
    default: false,
  },
});

const icon = computed(() => {
  return {
    success: CheckCircleIcon,
    error: AlertIcon,
  }[props.type];
});

const isVisible = ref(props.show);

watchEffect(() => {
  if (props.show) {
    isVisible.value = true;
    setTimeout(() => {
      isVisible.value = false;
    }, 3000);
  }
});
</script>

<template>
  <transition name="slide-fade">
    <div v-if="isVisible" class="toast toast-bottom">
      <div :class="`alert bg-base-300 border-neutral-content`">
        <component
          :is="icon"
          :class="{
            'text-success': type === 'success',
            'text-error': type === 'error',
          }"
        />
        <span>{{ message }}</span>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition:
    transform 0.3s ease-in-out,
    opacity 0.3s ease-in-out;
}

.slide-fade-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
