<template>
  <dialog id="report_modal" class="modal">
    <div class="modal-box flex justify-center flex-col align-center">
      <div>
        <div class="flex gap-2 align-middle align-center">
          <button
            type="button"
            class="btn btn-sm"
            :class="`btn-${activeMode === 'month' ? 'neutral' : 'ghost'}`"
            @click="applyPredefined('month')"
          >
            Month
          </button>

          <button
            type="button"
            class="btn btn-sm"
            :class="`btn-${activeMode === 'year' ? 'neutral' : 'ghost'}`"
            @click="applyPredefined('year')"
          >
            Year
          </button>
        </div>

        <div v-if="activeMode === 'custom'" class="flex gap-4">
          <div class="flex flex-col">
            <label for="start_date" class="label">Start Date</label>
            <input id="start_date" type="date" v-model="startDate" class="input input-bordered" />
          </div>
          <div class="flex flex-col">
            <label for="end_date" class="label">End Date</label>
            <input id="end_date" type="date" v-model="endDate" class="input input-bordered" />
          </div>
        </div>

        <div
          v-else-if="activeMode === 'month' || activeMode === 'year'"
          class="flex justify-start mt-4 gap-4"
        >
          <select
            v-if="activeMode === 'year' || activeMode === 'month'"
            class="select select-bordered w-32 select-sm"
            v-model="year"
          >
            <option v-for="option in yearOptions" :value="option.value" :key="option.value">
              {{ option.label }}
            </option>
          </select>
          <select
            v-if="activeMode === 'month'"
            class="select select-bordered w-32 select-sm"
            v-model="month"
          >
            <option v-for="option in monthOptions" :value="option.value" :key="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <div class="flex justify-start mt-4">
          <button class="btn btn-primary w-32 btn-sm" @click="generateReport">Apply</button>
        </div>
      </div>

      <NewReport
        v-if="activeMode === 'month' || activeMode === 'year'"
        :report="monthReport?.report"
        :mode="selectedMode"
        :loading="isFetching"
      />

      <div class="mt-6 flex justify-center">
        <button class="btn w-32 btn-sm" @click="onClose">Close</button>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { ref } from 'vue';
import NewReport from '~/components/NewReport.vue';
import { useGenerateMonthReport, useGenerateReport } from '~/services/activity.service';

const startDate = ref('');
const endDate = ref('');
const activeMode = ref<'month' | 'year' | 'custom'>('month');
const selectedMode = ref<'month' | 'year'>('month');
const month = ref(1);
const year = ref(dayjs().year());

const yearOptions = computed(() => {
  const currentYear = dayjs().year();

  return Array.from({ length: currentYear - 2024 + 1 }, (_, i) => {
    const year = currentYear - i;
    return { value: year, label: year.toString() };
  });
});

const monthOptions = computed(() => {
  const currentMonth = dayjs().month();

  return Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const isDisabled = year.value === dayjs().year() && month >= currentMonth + 1;

    return {
      value: month,
      label: dayjs().month(i).format('MMMM'),
      disabled: isDisabled,
    };
  }).filter((m) => !m.disabled);
});

const onClose = () => {
  document.getElementById('report_modal')?.close();
};

const {
  data: report,
  refetch,
  isFetching,
} = useGenerateReport({
  from: startDate,
  to: endDate,
  enabled: ref(false),
});

const { data: monthReport, refetch: refetchMonthReport } = useGenerateMonthReport({
  month,
  year,
  enabled: ref(false),
});

watch(activeMode, (v) => {
  if (activeMode.value === 'year') {
    month.value = null;
  }

  if (activeMode.value === 'custom') {
    month.value = null;
    year.value = null;
  }
});

watchEffect(() => {
  selectedMode.value = monthReport.value?.report?.mode;
});

const initDates = () => {
  const now = dayjs();
  startDate.value = now.startOf('month').format('YYYY-MM-DD');
  endDate.value = now.endOf('month').format('YYYY-MM-DD');
};
initDates();

const applyPredefined = (range: 'month' | 'year' | 'custom') => {
  activeMode.value = range;
};

const generateReport = () => {
  if (activeMode.value === 'month' || activeMode.value === 'year') {
    refetchMonthReport();
  } else {
    refetch();
  }
};
</script>
