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
import { useGetHistoryByRange } from '~/services/activity.service';

const props = defineProps({
  range: {
    type: String,
    default: 'week',
  },
});

const getCurrentWeekRange = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return {
    from: monday.toISOString().split('T')[0],
    to: sunday.toISOString().split('T')[0],
  };
};

const getCurrentMonthRange = () => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return {
    from: firstDayOfMonth.toISOString().split('T')[0],
    to: lastDayOfMonth.toISOString().split('T')[0],
  };
};

const getCurrentYearRange = () => {
  const today = new Date();
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const lastDayOfYear = new Date(today.getFullYear(), 11, 31);
  return {
    from: firstDayOfYear.toISOString().split('T')[0],
    to: lastDayOfYear.toISOString().split('T')[0],
  };
};

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

const range = computed(() => {
  if (props.range === 'week') {
    return getCurrentWeekRange();
  }
  if (props.range === 'month') {
    return getCurrentMonthRange();
  }
  return getCurrentYearRange();
});

const from = computed(() => range.value.from);
const to = computed(() => range.value.to);

const { data, refetch } = useGetHistoryByRange(from, to);

watch([from, to], () => {
  refetch();
});

const history = computed(() => data?.value?.history || {});

const modes = [
  { key: 'list', label: 'List View' },
  { key: 'pie', label: 'Pie Chart' },
  { key: 'bar', label: 'Bar Chart' },
];
const currentMode = ref('list');

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
  maintainAspectRatio: false, // Allows the chart to fill the container's height
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.label}: ${context.raw.toFixed(1)} hours`,
      },
    },
  },
}));
</script>

<template>
  <div class="p-6 rounded-md shadow-md space-y-6">
    <div class="flex gap-2 mb-4">
      <button
        v-for="mode in modes"
        :key="mode.key"
        @click="currentMode = mode.key"
        :class="['btn', currentMode === mode.key ? 'btn-primary' : 'btn-ghost']"
      >
        {{ mode.label }}
      </button>
    </div>

    <div v-if="currentMode === 'list'" class="space-y-4">
      <div v-for="(activities, typeTitle) in history" :key="typeTitle" class="border-t pt-4">
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
              {{ String.fromCodePoint(parseInt(activity.icon, 16)) }}
            </div>
            <div>
              <p class="font-medium">{{ activity.title }}</p>
              <p class="text-sm text-gray-500">{{ (activity.sum_min / 60).toFixed(1) }} hours</p>
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
