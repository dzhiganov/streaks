<script setup>
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import dayjs from 'dayjs';
import { computed, toRefs, watch } from 'vue';
import { Bar } from 'vue-chartjs';
import { useGetAggregatedHistory } from '~/services/activity.service'; // new hook
import {
  getCurrentDayRange,
  getCurrentMonthRange,
  getCurrentWeekRange,
  getCurrentYearRange,
} from '~/utils/ranges.js';

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarController, BarElement);

const props = defineProps({
  date: { type: String, required: true },
  // range should be an object with { from, to, type }
  // where type can be 'day', 'week', 'month', or 'year'=
  rangeType: { type: String, default: 'month' },
});

const { date, rangeType } = toRefs(props);

const range = computed(() => {
  if (rangeType.value === 'week') {
    return getCurrentWeekRange(date.value);
  }
  if (rangeType.value === 'month') {
    return getCurrentMonthRange(date.value);
  }
  if (rangeType.value === 'year') {
    return getCurrentYearRange(date.value);
  }

  return getCurrentDayRange(date.value);
});

const from = computed(() => range.value.from);
const to = computed(() => range.value.to);

// Use the new aggregated history hook.
const { data, refetch } = useGetAggregatedHistory({
  from: from,
  to: to,
  range: rangeType,
});

watch([date, range], () => refetch());

// Determine grouping: if range type is "year", group by month; otherwise, group by day.
const grouping = computed(() => (rangeType.value === 'year' ? 'month' : 'day'));

// Generate timeline labels based on grouping.
function generateTimeSeries(fromDate, toDate, grouping) {
  const labels = [];

  if (grouping === 'day') {
    let currentDate = new Date(fromDate);
    const endDate = new Date(toDate);
    while (currentDate <= endDate) {
      labels.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  } else if (grouping === 'month') {
    for (let i = 0; i < 12; i++) {
      const month = dayjs().month(i).format('YYYY-MM');
      labels.push(month);
    }
  }
  return labels;
}

const barChartData = computed(() => {
  if (!data.value?.history) return { labels: [], datasets: [] };
  const history = data.value.history;
  const labels = generateTimeSeries(data.value.from, data.value.to, grouping.value);
  const datasets = [];
  Object.entries(history).forEach(([category, activities]) => {
    Object.values(activities).forEach((activity) => {
      // Map aggregated rows: key -> time in hours.
      const progressMap = new Map(activity.rows.map((row) => [row.date, row.time_min / 60]));
      const dataPoints = labels.map((lbl) => progressMap.get(lbl) || 0);
      datasets.push({
        label: activity.title,
        data: dataPoints,
        backgroundColor: activity.color,
        borderColor: activity.color,
      });
    });
  });
  return { labels, datasets };
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
      type: 'category',
      offset: false, // ensures the chart spans the full width
      ticks: {
        autoSkip: false,
      },
    },
    y: {
      stacked: true,
      beginAtZero: true,
    },
  },
  plugins: {
    legend: { position: 'top' },
    tooltip: {
      callbacks: {
        label: (context) => `${context.dataset.label}: ${context.raw.toFixed(1)} hours`,
      },
    },
  },
}));
</script>

<template>
  <div class="p-6 rounded-md space-y-6 overflow-hidden">
    <h2 class="text-lg font-bold">Activity Progress Over Time</h2>
    <div class="h-96">
      <Bar v-if="barChartData.labels.length" :data="barChartData" :options="chartOptions" />
      <p v-else class="text-center">No data available for the selected range.</p>
    </div>
  </div>
</template>
