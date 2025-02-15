<template>
  <dialog id="report_modal" class="modal">
    <div class="modal-box">
      <div class="p-4">
        <div class="flex gap-2">
          <button type="button" class="btn text-primary btn-sm" @click="applyPredefined('month')">
            Month
          </button>
          <button type="button" class="btn text-primary btn-sm" @click="applyPredefined('year')">
            Year
          </button>
          <button type="button" class="btn text-primary btn-sm" @click="applyPredefined('5year')">
            5 Year
          </button>
        </div>

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

        <div class="flex justify-start mt-4">
          <button class="btn btn-primary w-32" @click="generateReport">Apply</button>
        </div>
      </div>

      <Report :report="report?.report" />
    </div>
  </dialog>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { ref } from 'vue';
import Report from '~/components/Report.vue';
import { useGenerateReport } from '~/services/activity.service';

const startDate = ref('');
const endDate = ref('');

const { data: report, refetch } = useGenerateReport({
  from: startDate,
  to: endDate,
  enabled: ref(false),
});

const initDates = () => {
  const now = dayjs();
  startDate.value = now.startOf('month').format('YYYY-MM-DD');
  endDate.value = now.endOf('month').format('YYYY-MM-DD');
};
initDates();

const applyPredefined = (range: 'month' | 'year' | '5year') => {
  const now = dayjs();
  switch (range) {
    case 'month':
      startDate.value = now.subtract(1, 'month').format('YYYY-MM-DD'); // Last 30 days
      endDate.value = now.format('YYYY-MM-DD');
      break;
    case 'year':
      startDate.value = now.subtract(1, 'year').format('YYYY-MM-DD'); // Last 365 days
      endDate.value = now.format('YYYY-MM-DD');
      break;
    case '5year':
      startDate.value = now.subtract(5, 'years').format('YYYY-MM-DD'); // Last 5 years
      endDate.value = now.format('YYYY-MM-DD');
      break;
  }
};

const generateReport = () => {
  refetch();
};
</script>
