<script setup>
import dayjs from 'dayjs';
import { EditIcon } from '~/assets/icons';
import { useGetGroupedHistory } from '~/services/activity.service';
import {
  getCurrentDayRange,
  getCurrentMonthRange,
  getCurrentWeekRange,
  getCurrentYearRange,
} from '~/utils/ranges';
import { formatTime } from '~/utils/time/formatTime';

const props = defineProps({
  date: {
    type: String,
    default: '',
  },
  range: {
    type: String,
    default: 'day',
  },
});

const emits = defineEmits(['edit-log-activity', 'repeat-log-activity']);

const computedRange = ref([]);

const { date, range } = toRefs(props);

watch(
  [range, date],
  () => {
    if (range.value === 'week') {
      return (computedRange.value = getCurrentWeekRange(date.value));
    }
    if (range.value === 'month') {
      return (computedRange.value = getCurrentMonthRange(date.value));
    }

    if (range.value === 'year') {
      return (computedRange.value = getCurrentYearRange(date.value));
    }

    return (computedRange.value = getCurrentDayRange(date.value));
  },
  { immediate: true },
);

const limit = computed(() => (range.value === 'year' ? 100 : 10000));

const { data } = useGetGroupedHistory({
  date,
  range: computedRange,
  limit,
});

const groupedActivities = computed(() => data.value?.history ?? {});

const getTimeColor = (time) => {
  if (time <= 30) {
    return 'text-base-content';
  }
  if (time <= 60) {
    return 'text-accent';
  }

  return 'text-primary';
};
</script>
<template>
  <div class="overflow-x-auto rounded-box bg-base-100">
    <table class="table">
      <thead>
        <tr class="border-b border-neutral-content">
          <th>#</th>
          <th>Activity Type</th>
          <th>Activity</th>
          <th>Duration (Total)</th>
          <th>Duration</th>
          <th>Logged At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <template
          v-for="(activities, activityType, typeIndex) in groupedActivities"
          :key="activityType"
        >
          <tr class="bg-base-400">
            <td colspan="8" class="font-bold text-lg">
              {{ activityType }}
            </td>
          </tr>

          <template
            v-for="(activity, activityName, activityIndex) in activities"
            :key="activityName"
          >
            <tr class="bg-base-300">
              <td>{{ typeIndex + 1 }}.{{ activityIndex + 1 }}</td>
              <td>{{ activityType }}</td>
              <td class="font-semibold">
                <div
                  :style="{ backgroundColor: activity.color }"
                  class="rounded-xl px-2 py-0.5 text-sm text-center w-fit"
                >
                  <span class="text-base-300">{{ activityName }}</span>
                </div>
              </td>
              <td class="font-semibold">{{ formatTime({ minutes: activity.sum }) }}</td>
              <td colspan="4"></td>
            </tr>
            <tr v-for="row in activity.rows" :key="row._id" class="">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td class="font-semibold">{{ row.time_min }} min</td>
              <td>{{ dayjs(row.date).format('D MMM YYYY') }}</td>
              <td>
                <div class="flex justify-end items-center gap-4">
                  <!-- <button class="icon-btn" @click="emits('repeat-log-activity', row)">
                    <RepeatIcon class="w-4 h-4" />
                  </button> -->
                  <button class="icon-btn" @click="emits('edit-log-activity', row)">
                    <EditIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </div>
</template>
