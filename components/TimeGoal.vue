<script setup>
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
  activityTitle: {
    type: String,
    default: '',
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

const progressColor = computed(() => {
  if (progress.value > 100) {
    return 'text-orange-400';
  } else if (progress.value === 100) {
    return 'text-green-600';
  } else if (progress.value >= 50) {
    return 'text-neutral';
  } else {
    return 'text-gray-400';
  }
});
</script>

<template>
  <div class="flex items-center gap-3">
    <div
      class="radial-progress font-semibold"
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
        <span class="font-bold text-neutral">{{
          formatTime({ minutes: restMinutes }, { short: true })
        }}</span>
      </div>
    </div>
  </div>
</template>
