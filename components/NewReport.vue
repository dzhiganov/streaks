<script setup lang="ts">
import { ArcElement, Chart as ChartJS, Legend, PieController, Title, Tooltip } from 'chart.js';
import { computed } from 'vue';
import { Pie } from 'vue-chartjs';
import { formatTime } from '~/utils/time/formatTime';

ChartJS.register(Title, Tooltip, Legend, PieController, ArcElement);

const props = defineProps<{
  report: any;
  mode: 'month' | 'year' | 'custom';
  loading: boolean;
}>();

const overallChangePercentage = computed(() => {
  return props.report?.overallChange.toFixed(0);
});

// Registering required Chart.js components
ChartJS.register(Title, Tooltip, Legend, PieController, ArcElement);

// Compute chart data
const chartData = computed(() => {
  const labels = props.report?.performanceByActivity.map(
    (activity) => activity.activityName + ` (${activity.percentage}%)`,
  );
  const data = props.report?.performanceByActivity.map((activity) => activity.totalMin);
  const backgroundColors = props.report?.performanceByActivity.map(
    (activity) => activity.activityColor,
  );

  return {
    labels,
    datasets: [
      {
        label: 'Performance by Activity',
        data,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors,
        borderWidth: 1,
      },
    ],
  };
});

// Options for the pie chart
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 1,
  plugins: {
    legend: {
      display: false,
      position: 'bottom',
      labels: {
        usePointStyle: true,
        color: '#777777',
        font: {
          family: 'Inter',
          size: 10,
          weight: 'normal',
        },
      },
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          return `${formatTime({ minutes: context.raw })}`;
        },
      },
    },
  },
}));
</script>

<template>
  <div class="my-2">
    <div v-if="loading" class="flex items-center justify-center min-h-32">
      <div class="loading loading-spinner loading-lg"></div>
    </div>
    <div
      v-else-if="report?.overallPerformance === undefined"
      class="flex items-center justify-center min-h-32"
    >
      Select a period and Click Apply to get the report.
    </div>
    <div
      v-else-if="report?.overallPerformance <= 0"
      class="flex items-center justify-center min-h-32"
    >
      No data for this period. Try a different period.
    </div>
    <div v-else class="mt-4 dark:bg-base-300 rounded-lg px-2 py-2 pb-4 flex flex-col items-center">
      <h2 class="text-xl font-semibold my-4">Overall Performance</h2>
      <table class="min-w-full table-auto border-collapse">
        <tbody>
          <tr>
            <td class="py-2 px-4 font-semibold">Performance</td>
            <td class="py-2 px-4">{{ formatTime({ minutes: report?.overallPerformance }) }}</td>
          </tr>
          <tr>
            <td class="py-2 px-4 font-semibold">
              {{ `Compare to previous ${mode === 'month' ? 'month' : 'year'}` }}
            </td>
            <td
              class="py-2 px-4 font-semibold"
              :class="{
                'text-green-500': overallChangePercentage > 0,
                'text-red-500': overallChangePercentage < 0,
                'text-neutral': overallChangePercentage === 0,
              }"
            >
              {{
                overallChangePercentage > 0
                  ? `+${overallChangePercentage}`
                  : overallChangePercentage
              }}
              %
            </td>
          </tr>
          <tr>
            <td class="py-2 px-4 font-semibold">
              Most active {{ mode === 'month' ? 'day' : 'month' }}
            </td>
            <td class="py-2 px-4">
              {{ formatTime({ minutes: report?.mostActive?.totalMin }) }}
              <div class="text-xs">{{ report?.mostActive?.label }}</div>
            </td>
          </tr>
          <tr>
            <td class="py-2 px-4 font-semibold">
              Least active {{ mode === 'month' ? 'day' : 'month' }}
            </td>
            <td class="py-2 px-4">
              {{ formatTime({ minutes: report?.leastActive?.totalMin }) }}
              <div class="text-xs">{{ report?.leastActive?.label }}</div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="mt-6 flex flex-col items-center">
        <h2 class="text-xl font-semibold my-4">Performance by Activity</h2>
        <div>
          <Pie :data="chartData" :options="chartOptions" class="h-[300px] w-[300px]" />
        </div>
      </div>
    </div>
  </div>
</template>
