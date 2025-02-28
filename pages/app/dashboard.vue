<script setup>
import 'cally';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import { ref } from 'vue';
import {
  AlertIcon,
  ArrowLeft,
  ArrowRight,
  BarIcon,
  FileTextIcon,
  PlusIcon,
  TableIcon,
} from '~/assets/icons';
import Goals from '~/components/Goals.vue';
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

const { getSession } = useAuth();

const user = ref({});

onMounted(async () => {
  const session = await getSession();
  user.value = session?.user ?? {};
});

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

const setPreviousDate = () => {
  selectedDate.value = dayjs(selectedDate.value)
    .subtract(1, selectedRange.value)
    .format('YYYY-MM-DD');
};

const setNextDate = () => {
  selectedDate.value = dayjs(selectedDate.value).add(1, selectedRange.value).format('YYYY-MM-DD');
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

const toggleView = (view) => {
  console.log(router);
  router.push({ query: { view } });
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

const showTrialWarning = computed(() => {
  if (!user.value) return false;
  return user.value?.subscription?.plan === 'trial';
});

const trialExpiresAt = computed(() => {
  if (!user.value) return 0;
  return dayjs(user.value?.subscription?.trialExpiresAt).diff(dayjs(), 'days');
});
</script>
<template>
  <div class="min-h-screen flex w-full">
    <aside class="px-6 py-4 border-r border-neutral-content h-screen">
      <div class="flex items-center gap-2">
        <h1 class="text-lg font-bold font-header">FlowTracks</h1>
        <div class="badge badge-primary badge-sm cursor-pointer font-semibold" @click="goToBeta">
          Beta
        </div>
      </div>

      <div
        v-if="showTrialWarning"
        class="mt-4 bg-orange-200 text-orange-900 p-4 p-2 rounded-xl flex flex-col justify-center items-center shadow-md gap-2 border border-neutral-content"
      >
        <AlertIcon class="w-5 h-5" />
        <span class="text-sm"
          >Heads Up! Trial ends in
          <span class="font-bold text">{{ trialExpiresAt }}</span> days</span
        >

        <NuxtLink to="/upgrade" class="btn btn-sm btn-ghost w-full">Upgrade to PRO</NuxtLink>
      </div>
      <div class="flex flex-col gap-10 mt-8">
        <div class="bg-base-300 rounded-lg flex justify-center items-start min-h-[330px]">
          <calendar-date
            :value="selectedDate"
            @change="
              (event) => {
                selectedDate = event.target.value;
              }
            "
          >
            <div slot="previous" class="p-2 py-4">
              <ArrowLeft class="w-5 h-5 text-gray-500" />
            </div>
            <div slot="next" class="p-2 py-4">
              <ArrowRight class="w-5 h-5 text-gray-500" />
            </div>
            <calendar-month />
          </calendar-date>
        </div>
        <Goals @edit-activity="onEditActivity" />
        <button class="btn btn-neutral" onclick="report_modal.showModal()">
          <FileTextIcon class="w-4 h-4" />
          <span>Generate Report</span>
        </button>
      </div>
    </aside>
    <main class="px-2 flex flex-col bg-base-300 w-full">
      <div class="mb-12">
        <Header>
          <div class="flex items-center gap-4 w-full px-2">
            <div class="flex items-center gap-4 justify-end w-full">
              <select class="select select-bordered select-sm" v-model="selectedRange">
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>

              <div class="dropdown">
                <div tabindex="0" role="button" class="btn btn-neutral btn-sm">
                  <PlusIcon class="w-5 h-5" />
                  <span>Create</span>
                  <span>⏷</span>
                </div>
                <ul
                  tabindex="0"
                  class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow border border-neutral-content"
                >
                  <li>
                    <button
                      class="btn btn-ghost btn-sm"
                      onclick="add_new_activity_modal.showModal()"
                    >
                      Activity
                    </button>
                  </li>
                  <li>
                    <button
                      class="btn btn-ghost btn-sm"
                      onclick="new_activity_type_modal.showModal()"
                    >
                      Activity Type
                    </button>
                  </li>
                </ul>
              </div>

              <div class="dropdown dropdown-bottom dropdown-end">
                <button class="btn btn-primary btn-sm" onclick="log_activity_modal.showModal()">
                  <PlusIcon class="w-5 h-5" />
                  <span>Activity</span>
                </button>
              </div>
            </div>
          </div>
        </Header>
      </div>

      <div v-if="route.query?.view === 'table' || route.query?.view === 'graph'" class="mb-2 px-12">
        <div class="flex mb-2 gap-4 items-center">
          <div class="text-lg font-semibold w-64">Activity for {{ rangeTitle }}</div>
          <div class="flex items-center gap-1">
            <button class="btn btn-ghost btn-sm font-semibold text-lg" @click="setPreviousDate">
              <
            </button>
            <button
              class="btn btn-ghost btn-sm text-blue-500"
              @click="setTodayDate"
              :disabled="dayjs(selectedDate).isToday()"
            >
              Today
            </button>
            <button class="btn btn-ghost btn-sm font-semibold text-lg" @click="setNextDate">
              >
            </button>
          </div>
          <div class="flex items-center gap-2 ml-auto">
            <button
              class="btn btn-sm ml-auto"
              :class="{
                'btn-neutral': route.query?.view === 'table',
                'btn-ghost': route.query?.view !== 'table',
              }"
              @click="() => toggleView('table')"
            >
              <TableIcon class="w-5 h-5" />
              <span>Table View</span>
            </button>
            <span class="text-gray-500">/</span>
            <button
              class="btn btn-sm ml-auto"
              :class="{
                'btn-neutral': route.query?.view === 'graph',
                'btn-ghost': route.query?.view !== 'graph',
              }"
              @click="() => toggleView('graph')"
            >
              <BarIcon class="w-5 h-5" />
              <span>Graph View</span>
            </button>
          </div>
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
  @apply text-[12px];
  width: 2rem;
  height: 2rem;
}
</style>
