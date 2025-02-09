<template>
  <div class="p-4 space-y-4">
    <!-- Predefined ranges -->
    <div class="flex gap-2">
      <button type="button" class="btn" @click="applyPredefined('month')">Month</button>
      <button type="button" class="btn" @click="applyPredefined('year')">Year</button>
      <button type="button" class="btn" @click="applyPredefined('5year')">5 Year</button>
    </div>

    <!-- Custom date range -->
    <div class="flex gap-4">
      <div class="flex flex-col">
        <label for="start_date" class="label">Start Date</label>
        <input id="start_date" type="date" v-model="startDate" class="input input-bordered" />
      </div>
      <div class="flex flex-col">
        <label for="end_date" class="label">End Date</label>
        <input id="end_date" type="date" v-model="endDate" class="input input-bordered" />
      </div>
    </div>

    <!-- Generate button -->
    <div>
      <button class="btn btn-primary" @click="generateReport">Generate Report</button>
    </div>
  </div>

  <Report :from="startDate" :to="endDate" />
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { defineEmits, ref } from 'vue';
import Report from '~/components/Report.vue';

const emit = defineEmits<{
  (e: 'generate', payload: { start: string; end: string }): void;
}>();

// Date state (HTML date inputs use YYYY-MM-DD)
const startDate = ref('');
const endDate = ref('');

// Initialize with current month by default
const initDates = () => {
  const now = dayjs();
  startDate.value = now.startOf('month').format('YYYY-MM-DD');
  endDate.value = now.endOf('month').format('YYYY-MM-DD');
};
initDates();

// Apply a predefined date range
const applyPredefined = (range: 'month' | 'year' | '5year') => {
  const now = dayjs();
  switch (range) {
    case 'month':
      startDate.value = now.startOf('month').format('YYYY-MM-DD');
      endDate.value = now.endOf('month').format('YYYY-MM-DD');
      break;
    case 'year':
      startDate.value = now.startOf('year').format('YYYY-MM-DD');
      endDate.value = now.endOf('year').format('YYYY-MM-DD');
      break;
    case '5year':
      startDate.value = now.subtract(5, 'year').format('YYYY-MM-DD');
      endDate.value = now.format('YYYY-MM-DD');
      break;
  }
};

// Emit the date range for report generation
const generateReport = () => {
  if (!startDate.value || !endDate.value) return;
  document.getElementById('report_modal').showModal();
};
</script>
