<script setup>
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  PieController,
  Title,
  Tooltip,
} from 'chart.js';
import { computed, ref } from 'vue';
import { Bar, Pie } from 'vue-chartjs';
import { ClockIcon, GoalIcon } from '~/assets/icons';
import { useGetHistoryByRange } from '~/services/activity.service';
import { getIcon } from '~/utils/getIcon';
import {
  getCurrentDayRange,
  getCurrentMonthRange,
  getCurrentWeekRange,
  getCurrentYearRange,
} from '~/utils/ranges.js';

const props = defineProps({
  showOptions: {
    type: Boolean,
    default: true,
  },
  range: {
    type: String,
  },
  date: {
    type: String,
  },
});

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PieController,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
);

const { range: timeRange, date } = toRefs(props);

const range = computed(() => {
  if (timeRange.value === 'week') {
    return getCurrentWeekRange(date.value);
  }
  if (timeRange.value === 'month') {
    return getCurrentMonthRange(date.value);
  }
  if (timeRange.value === 'year') {
    return getCurrentYearRange(date.value);
  }

  return getCurrentDayRange(date.value);
});

const from = computed(() => {
  return range.value.from;
});
const to = computed(() => range.value.to);

const goals = ref({});

const { data, refetch } = useGetHistoryByRange(from, to);

watch([from, to], () => {
  refetch();
});

const history = computed(() => data?.value?.history || {});

const modes = [
  { key: 'pie', label: 'Pie Chart' },
  { key: 'bar', label: 'Bar Chart' },
];

const currentMode = ref('bar');

function sortedActivities(activities) {
  return Object.values(activities).sort((a, b) => b.sum_min - a.sum_min);
}

const chartData = computed(() => {
  const labels = [];
  const data = [];
  const backgroundColors = [];

  Object.entries(history.value).forEach(([type, activities]) => {
    Object.values(activities).forEach((activity) => {
      labels.push(activity.title);
      goals.value = {
        ...goals.value,
        [activity.title]: activity.week_time_goal_min,
      };
      data.push(activity.sum_min / 60);
      backgroundColors.push(activity.color);
    });
  });

  return {
    labels,
    datasets: [
      {
        label: 'Hours Spent',
        data,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors,
        borderWidth: 1,
      },
    ],
  };
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        title: (ctx) => {
          const [{ label }] = ctx;

          if (!goals.value[label]) {
            return label;
          }

          return `${label} (Goal: ${goals.value[label] / 60} hours)`;
        },
        label: (context) => `${context.label}: ${context.raw.toFixed(1)} hours`,
      },
    },
  },
}));
</script>

<template>
  <div class="p-6 rounded-md space-y-6 bg-base-200 overflow-hidden">
    <div class="flex gap-4 items-center">
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">View mode</span>
        </div>
        <select
          v-if="showOptions"
          v-model="currentMode"
          class="select select-bordered w-full max-w-xs"
        >
          <option v-for="mode in modes" :key="mode.key" :value="mode.key">
            {{ mode.label }}
          </option>
        </select>
      </label>
    </div>

    <div v-if="currentMode === 'list'" class="space-y-4">
      <div v-for="(activities, typeTitle) in history" :key="typeTitle">
        <h2 class="text-lg font-bold mb-2">{{ typeTitle }}</h2>
        <ul class="space-y-2">
          <li
            v-for="activity in sortedActivities(activities)"
            :key="activity.title"
            class="flex items-center gap-4"
          >
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center"
              :style="{ backgroundColor: activity.color }"
            >
              {{ getIcon(activity.icon, activity.title) }}
            </div>
            <div>
              <div class="overflow-hidden truncate w-full">
                <p class="font-medium">{{ activity.title }}</p>
              </div>

              <p class="text-sm flex gap-2 items-center">
                <ClockIcon class="w-4 h-4" /> Complete:
                {{ (activity.sum_min / 60).toFixed(1) }} hours
              </p>
              <p
                v-if="range === 'week' && activity.week_time_goal_min"
                class="text-sm flex gap-2 items-center mt-1"
              >
                <GoalIcon class="w-4 h-4" /> Goal: {{ activity.week_time_goal_min / 60 }} hours
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="currentMode === 'pie'" class="h-96">
      <Pie :data="chartData" class="h-full" :options="chartOptions" />
    </div>

    <div v-if="currentMode === 'bar'" class="h-96">
      <Bar :data="chartData" class="h-full" />
    </div>
  </div>
</template>
