<script setup>
import { useTheme } from '~/composables/useTheme';
import { formatTime } from '~/utils/time/formatTime';

const theme = useTheme();

const props = defineProps({
  type: {
    type: String,
    default: 'day',
  },
  goalMinutes: {
    type: Number,
    default: 0,
  },
  restMinutes: {
    type: Number,
    default: 0,
  },
  activityTitle: {
    type: String,
    default: '',
  },
});

const getProgress = (timeGoal, timeRest) => {
  const res = Math.round(100 - (timeRest / timeGoal) * 100);
  return res;
};

const title = computed(() => {
  const prefix = 'Left this';

  return `${prefix} ${props.type}: `;
});

const progress = computed(() => {
  return getProgress(props.goalMinutes, props.restMinutes);
});

const progressColor = computed(() => {
  if (progress.value > 100) {
    return 'text-orange-400 progress-very-high';
  } else if (progress.value === 100) {
    return 'text-green-600 progress-high';
  } else if (progress.value >= 50) {
    return 'text-neutral-content progress-medium';
  } else {
    return 'text-gray-500 progress-low';
  }
});
</script>

<template>
  <div class="flex items-center gap-3">
    <div
      class="radial-progress font-semibold shrink-0 progress-custom"
      :class="progressColor"
      :style="'--value:' + progress + ';--size:3rem; font-size: 0.8rem;'"
      role="progressbar"
    >
      {{ `${progress} %` }}
    </div>
    <div>
      <p class="w-full font-medium flex gap-2 w-full truncate font-semibold">
        {{ activityTitle }}
      </p>

      <div class="flex items-center gap-2 text-sm text-gray-500">
        <span>{{ title }}</span>
        <span class="font-bold">{{ formatTime({ minutes: restMinutes }, { short: true }) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.progress-custom {
  --thickness: 0.2rem;
}
</style>
