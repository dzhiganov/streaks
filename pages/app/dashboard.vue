<script setup>
import 'cally';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import { ref } from 'vue';
import { ArrowLeft, ArrowRight, EyeIcon, FileTextIcon, PlusIcon } from '~/assets/icons';
import Goals from '~/components/Goals.vue';
import Header from '~/components/Header.vue';
import HistoryTable from '~/components/HistoryTable.vue';
import LineChart from '~/components/LineChart.vue';
import Messages from '~/components/Messages.vue';
import NewActivityTypeModal from '~/components/NewActivityTypeModal.vue';
import ReportForm from '~/components/ReportForm.vue';
import YearViewWarning from '~/components/YearViewWarning.vue';

dayjs.extend(isToday);

const selectedRange = ref('day');
const selectedDate = ref(dayjs().format('YYYY-MM-DD'));
const editedActivityId = ref(null);
const predefinedActivity = ref(null);

const rangeTitle = computed(() => {
  if (selectedRange.value === 'day') {
    return dayjs(selectedDate.value).format('DD MMMM YYYY');
  }
  if (selectedRange.value === 'week') {
    return (
      dayjs(selectedDate.value).startOf('week').format('D MMM') +
      ' - ' +
      dayjs(selectedDate.value).endOf('week').format('D MMM')
    );
  }
  if (selectedRange.value === 'month') {
    return dayjs(selectedDate.value).format('MMMM');
  }
  if (selectedRange.value === 'year') {
    return dayjs(selectedDate.value).format('YYYY');
  }
});

const setTodayDate = () => {
  selectedDate.value = dayjs().format('YYYY-MM-DD');
};

const onEditLogActivity = (val) => {
  editedActivityId.value = val;
  document.getElementById('log_activity_modal').showModal();
};

const router = useRouter();
const route = useRoute();

onMounted(() => {
  router.push({ query: { view: 'table' } });
});

const toggleView = () => {
  router.push({ query: { view: route.query.view === 'table' ? 'graph' : 'table' } });
};

const onRepeatLogActivity = (row) => {
  predefinedActivity.value = {
    activityId: row.activity._id,
    time_min: row.time_min,
  };
  document.getElementById('log_activity_modal').showModal();
};

const editedActivity = ref({});

provide('editedActivity', editedActivity);

const onEditActivity = (activity) => {
  editedActivity.value = activity;
  document.getElementById('add_new_activity_modal').showModal();
};
</script>
<template>
  <div class="grid min-h-screen grid-rows-[auto_1fr] grid-cols-[300px_minmax(0,1fr)]">
    <Header>
      <div class="flex items-center gap-4 w-full px-8">
        <div class="flex items-center gap-4 justify-end w-full">
          <select class="select select-bordered" v-model="selectedRange">
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>

          <div class="dropdown dropdown-bottom dropdown-end">
            <button class="btn btn-primary" onclick="log_activity_modal.showModal()">
              <PlusIcon class="w-5 h-5" />
              <span>Add Activity</span>
            </button>
          </div>
        </div>
      </div>
    </Header>
    <aside class="px-4 border-r border-neutral-content">
      <div class="flex flex-col gap-10 mt-8">
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-neutral">
            <PlusIcon class="w-5 h-5" />
            <span>Create</span>
            <span>⏷</span>
          </div>
          <ul
            tabindex="0"
            class="dropdown-content menu bg-base-300 rounded-box z-[1] w-52 p-2 shadow"
          >
            <li>
              <button class="btn btn-ghost" onclick="add_new_activity_modal.showModal()">
                Activity
              </button>
            </li>
            <li>
              <button class="btn btn-ghost" onclick="new_activity_type_modal.showModal()">
                Activity Type
              </button>
            </li>
          </ul>
        </div>
        <div>
          <calendar-date
            :value="selectedDate"
            @change="
              (event) => {
                selectedDate = event.target.value;
              }
            "
          >
            <ArrowLeft slot="previous" class="w-5 h-5 text-gray-500" />
            <ArrowRight slot="next" class="w-5 h-5 text-gray-500" />
            <calendar-month />
          </calendar-date>
        </div>
        <Goals @edit-activity="onEditActivity" />
        <button class="btn btn-neutral" onclick="report_modal.showModal()">
          <FileTextIcon class="w-5 h-5" />
          <span>Generate Report</span>
        </button>
      </div>
    </aside>
    <main class="px-12 py-4 flex flex-col">
      <div v-if="route.query?.view === 'table' || route.query?.view === 'graph'" class="mb-6">
        <div class="flex mb-2 gap-4 items-center">
          <div class="text-lg font-semibold">Activity for {{ rangeTitle }}</div>
          <div>
            <button
              class="btn btn-ghost btn-sm text-blue-500"
              @click="setTodayDate"
              :disabled="dayjs(selectedDate).isToday()"
            >
              Today
            </button>
          </div>
          <button class="btn btn-ghost btn-sm ml-auto" @click="toggleView">
            <EyeIcon class="w-5 h-5" />
            <span>Toggle View</span>
          </button>
        </div>
      </div>
      <LineChart
        v-if="route.query?.view === 'graph'"
        :date="selectedDate"
        :range-type="selectedRange"
      />
      <Messages
        v-else-if="route.query?.view === 'messages'"
        :date="selectedDate"
        :range="selectedRange"
      />
      <HistoryTable
        v-else
        :date="selectedDate"
        :range="selectedRange"
        @edit-log-activity="onEditLogActivity"
        @repeat-log-activity="onRepeatLogActivity"
      />
    </main>
  </div>
  <NewActivityModal />
  <NewActivityTypeModal />
  <LogActivityModal
    :date="selectedDate"
    v-model:edited-activity="editedActivityId"
    v-model:predefined-activity="predefinedActivity"
  />
  <ReportForm />
  <YearViewWarning v-if="selectedRange === 'year' && route.query?.view === 'table'" />
</template>

<style>
calendar-date::part(button) {
  border: none !important;
  background-color: transparent !important;
}

calendar-month {
  --color-accent: theme('colors.neutral') !important;
  --color-text-on-accent: theme('colors.neutral-content') !important;
}

calendar-month::part(button) {
  border-radius: 50%;
}
</style>
