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
import dayjs from 'dayjs';
import { computed, ref } from 'vue';
import { Bar, Pie } from 'vue-chartjs';
import { useGetHistoryByRange } from '~/services/activity.service';
import { getIcon } from '~/utils/getIcon';

const props = defineProps({
  range: {
    type: String,
    default: 'week',
  },
  showOptions: {
    type: Boolean,
    default: true,
  },
});

const getCurrentWeekRange = () => {
  const monday = dayjs().startOf('isoWeek');
  const sunday = monday.add(6, 'day').endOf('day');

  return {
    from: monday.format('YYYY-MM-DD'),
    to: sunday.format('YYYY-MM-DD'),
  };
};

const getCurrentMonthRange = () => {
  const firstDayOfMonth = dayjs().startOf('month');
  const lastDayOfMonth = dayjs().endOf('month');

  return {
    from: firstDayOfMonth.format('YYYY-MM-DD'),
    to: lastDayOfMonth.format('YYYY-MM-DD'),
  };
};

const getCurrentYearRange = () => {
  const firstDayOfYear = dayjs().startOf('year');
  const lastDayOfYear = dayjs().endOf('year');

  return {
    from: firstDayOfYear.format('YYYY-MM-DD'),
    to: lastDayOfYear.format('YYYY-MM-DD'),
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

const goals = ref({});

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
  maintainAspectRatio: false, // Allows the chart to fill the container's height
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
  <div class="p-6 rounded-md space-y-6 bg-base-200">
    <div v-if="showOptions" class="flex gap-2 mb-4">
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
              <p class="font-medium">{{ activity.title }}</p>
              <p class="text-sm text-gray-500">⌛ {{ (activity.sum_min / 60).toFixed(1) }} hours</p>
              <p
                v-if="props.range === 'week' && activity.week_time_goal_min"
                class="text-sm text-gray-500"
              >
                🎯 Goal: {{ activity.week_time_goal_min / 60 }} hours
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
