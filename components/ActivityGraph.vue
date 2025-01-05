<template>
  <div class="p-6 bg-white rounded-md shadow-md space-y-6">
    <div class="flex gap-2 mb-4">
      <button
        v-for="mode in modes"
        :key="mode.key"
        @click="currentMode = mode.key"
        :class="['btn', currentMode === mode.key ? 'btn-primary' : 'btn-secondary']"
      >
        {{ mode.label }}
      </button>
    </div>

    <div v-if="currentMode === 'list'" class="space-y-4">
      <div v-for="(activities, typeTitle) in historyData" :key="typeTitle" class="border-t pt-4">
        <h2 class="text-lg font-bold mb-2">{{ typeTitle }}</h2>
        <ul class="space-y-2">
          <li
            v-for="activity in sortedActivities(activities)"
            :key="activity.title"
            class="flex items-center gap-4"
          >
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-white"
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

    <div v-if="currentMode === 'radar'" class="h-96">
      <Radar :data="chartData" />
    </div>

    <div v-if="currentMode === 'bar'" class="h-96">
      <Bar :data="chartData" />
    </div>
  </div>
</template>

<script setup>
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadarController,
  RadialLinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { computed, ref } from 'vue';
import { Bar, Radar } from 'vue-chartjs';
import { useActivityService } from '~/services/activity.service';

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

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  RadarController,
  BarController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
);

const historyData = ref([]);

const { getHistoryByRange } = useActivityService();

onMounted(async () => {
  const { from, to } = getCurrentWeekRange();
  const { history = [] } = (await getHistoryByRange(from, to)) || {};
  historyData.value = history;
});

const modes = [
  { key: 'list', label: 'List View' },
  { key: 'radar', label: 'Radar Chart' },
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

  Object.entries(historyData.value).forEach(([type, activities]) => {
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
</script>

<style scoped>
.btn {
  @apply px-4 py-2 rounded-md text-sm font-medium transition duration-300;
}
.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}
.btn-secondary {
  @apply bg-gray-200 text-gray-700 hover:bg-gray-300;
}
</style>
