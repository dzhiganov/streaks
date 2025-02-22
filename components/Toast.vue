<script setup>
import { computed } from 'vue';
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
});

const icon = computed(() => {
  const icons = {
    success: CheckCircleIcon,
    error: AlertIcon,
  };

  return icons[props.type];
});
</script>

<template>
  <div class="toast toast-bottom">
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
</template>
