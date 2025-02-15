<template>
  <div v-if="report" class="max-w-md mx-auto p-6">
    <div class="pt-4 flex justify-between items-center">
      <div>
        <h3 class="text-md font-semibold">Overall Activity</h3>
        <p class="text-sm">{{ report?.overallPerformance ?? 0 }} minutes</p>
      </div>
      <div class="text-right">
        <span class="text-xl font-bold">{{ overallHours }}</span>
      </div>
    </div>

    <div class="mt-6">
      <h3 class="text-md font-semibold mb-3">Activities</h3>
      <div v-if="topActivities.length === 0" class="text-center">No activities</div>

      <ul v-else class="space-y-1">
        <li
          v-for="(activity, index) in topActivities"
          :key="activity.activityId"
          class="flex justify-between items-center p-3 rounded-lg shadow-sm"
        >
          <span class="font-medium"> {{ index + 1 }}. {{ activity.activityName }} </span>
          <span class="text-sm font-semibold">
            {{ formatTime({ minutes: activity.totalMin }, { short: true }) }}
            <span class="text-xs text-primary">({{ getPercentage(activity.totalMin) }}%)</span>
          </span>
        </li>
      </ul>
    </div>

    <div class="mt-4">
      <h3 class="text-md font-semibold mb-3">Summary</h3>
    </div>

    <div v-if="report?.mostActiveDay" class="mt-2 text-sm flex justify-between">
      <span class="font-semibold">💪 Most Active Day: </span>
      <span>
        <span class="font-semibold mr-1">{{
          dayjs(report?.mostActiveDay.date).format('D MMM YYYY')
        }}</span>
        <span class="text-xs text-primary font-semibold"
          >({{ formatTime({ minutes: report?.mostActiveDay.totalMin }, { short: true }) }})</span
        >
      </span>
    </div>
    <div v-if="report?.leastActiveDay" class="mt-2 text-sm flex justify-between">
      <span class="font-semibold">😴 Least Active Day: </span>
      <span>
        <span class="font-semibold mr-1">{{
          dayjs(report?.leastActiveDay.date).format('D MMM YYYY')
        }}</span>
        <span class="text-xs text-primary font-semibold"
          >({{ formatTime({ minutes: report?.leastActiveDay.totalMin }, { short: true }) }})</span
        >
      </span>
    </div>
  </div>

  <div v-else class="max-w-md mx-auto p-6 text-center text-sm italic">
    <p>Choose a date range and click apply to generate a report</p>
  </div>

  <div class="mt-6 flex justify-center">
    <button class="btn btn-neutral w-32" @click="onClose">Close</button>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { computed, toRefs } from 'vue';
import { formatTime } from '~/utils/time/formatTime';

const props = defineProps<{
  report: any;
  previousReport?: any; // Optional: Used for trend comparison
  goal?: number; // Optional: User-defined goal in hours
}>();

const { report, previousReport, goal } = toRefs(props);

const overallHours = computed(() => {
  if (!report.value) return '0 h';
  return formatTime({ minutes: report.value.overallPerformance || 0 }, { short: true });
});

const totalMinutes = computed(() => report.value?.overallPerformance ?? 0);

const topActivities = computed(() => {
  if (!report.value?.performanceByActivity) return [];
  return [...report.value.performanceByActivity].sort((a, b) => b.totalMin - a.totalMin);
});

const getPercentage = (minutes: number) => {
  return ((minutes / totalMinutes.value) * 100).toFixed(1);
};

const goalProgress = computed(() => {
  if (!goal.value) return null;
  return ((totalMinutes.value / (goal.value * 60)) * 100).toFixed(1);
});

const onClose = () => {
  document.getElementById('report_modal')?.close();
};
</script>
