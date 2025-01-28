<script setup>
import { CheckIcon } from '~/assets/icons';
import { formatTime } from '~/utils/time/formatTime';

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
});

const getProgress = (timeGoal, timeRest) => {
  const res = 100 - (timeRest / timeGoal) * 100;
  return res;
};

const title = computed(() => {
  const prefix = 'Left this';

  return `${prefix} ${props.type}: `;
});

const progress = computed(() => {
  return getProgress(props.goalMinutes, props.restMinutes);
});
</script>

<template>
  <div class="text-sm text-gray-500">
    <div v-if="progress >= 100">
      <div class="text-primary">
        <span
          v-if="getProgress(goalMinutes, restMinutes) >= 100"
          class="flex items-center gap-1 text-success"
        >
          <CheckIcon />
          <span>Done</span>
        </span>
      </div>
    </div>
    <template v-else>
      <div class="flex items-center gap-2">
        <span>{{ title }}</span>
        <span class="font-bold">{{ formatTime({ minutes: restMinutes }, { short: true }) }}</span>
      </div>

      <progress class="progress progress-primary" :value="progress" max="100"></progress>
    </template>
  </div>
</template>
