<script setup>
import dayjs from 'dayjs';
import { EditIcon, RepeatIcon } from '~/assets/icons';
import { useGetGroupedHistory } from '~/services/activity.service';
import {
  getCurrentDayRange,
  getCurrentMonthRange,
  getCurrentWeekRange,
  getCurrentYearRange,
} from '~/utils/ranges';

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

const emits = defineEmits(['edit-log-activity']);

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

const { data } = useGetGroupedHistory({ date, range: computedRange });

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
        <tr class="">
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
          <tr class="bg-base-300">
            <td colspan="8" class="font-bold text-lg">
              {{ activityType }}
            </td>
          </tr>

          <template
            v-for="(activity, activityName, activityIndex) in activities"
            :key="activityName"
          >
            <tr class="bg-base-200">
              <td>{{ typeIndex + 1 }}.{{ activityIndex + 1 }}</td>
              <td>{{ activityType }}</td>
              <td class="font-semibold">{{ activityName }}</td>
              <td class="font-semibold">{{ activity.sum }} min</td>
              <td colspan="4"></td>
            </tr>
            <tr v-for="(row, rowIndex) in activity.rows" :key="row._id" class="">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td class="font-semibold" :class="{ [getTimeColor(row.time_min)]: true }">
                {{ row.time_min }} min
              </td>
              <td>{{ dayjs(row.created_at).format('D MMM YYYY HH:mm') }}</td>
              <td>
                <div class="flex items-center gap-4">
                  <button class="icon-btn">
                    <RepeatIcon class="w-4 h-4" />
                  </button>
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
