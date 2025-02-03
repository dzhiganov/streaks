<script setup>
import dayjs from 'dayjs';
import {
  useDeleteLogActivity,
  useGetActivities,
  useLogActivity,
  useUpdateLogActivity,
} from '~/services/activity.service';

const props = defineProps({
  date: {
    type: Date,
    default: new Date(),
  },
  predefinedActivity: {
    type: Object,
    default: null,
  },
});

const editedActivity = defineModel('editedActivity', {
  type: Object,
  default: null,
});

const predefinedActivity = defineModel('predefinedActivity', {
  type: Object,
  default: null,
});

const selectedDate = ref(dayjs(props.date).format('YYYY-MM-DD'));
const selectedActivity = ref(null);
const duration = ref(0);
const { data: activitiesData } = useGetActivities({ onlyActive: true });
const activities = computed(() => activitiesData?.value?.activities || []);

const predefinedTimeOptions = computed(() => [25, 30, 50, 60, 90]);

watch(
  predefinedActivity,
  (newVal) => {
    if (newVal) {
      selectedActivity.value = newVal.activityId;
      duration.value = newVal.time_min;
    }
  },
  { immediate: true },
);

const { mutate: logActivity } = useLogActivity();
const { mutate: updateLogActivity } = useUpdateLogActivity();
const { mutate: deleteLogActivity } = useDeleteLogActivity();

const onLogActivity = async () => {
  if (editedActivity.value) {
    updateLogActivity({
      activity: selectedActivity.value,
      time_min: duration.value,
      id: editedActivity.value._id,
    });
  } else {
    logActivity({
      activity: selectedActivity.value,
      time_min: duration.value,
      date: selectedDate.value,
    });

    // showNotification.value = 'Activity logged';
    duration.value = '';
  }
  document.getElementById('log_activity_modal').close();
};

const onDeleteLogActivity = () => {
  deleteLogActivity(editedActivity.value._id);
  document.getElementById('log_activity_modal').close();
};

const setTodayDate = () => {
  selectedDate.value = dayjs().format('YYYY-MM-DD');
};

watch(
  editedActivity,
  (newVal) => {
    if (newVal) {
      selectedActivity.value = newVal.activity._id;
      duration.value = newVal.time_min;
      selectedDate.value = dayjs(newVal.date).format('YYYY-MM-DD');
    }
  },
  { immediate: true },
);

const onClose = () => {
  editedActivity.value = null;
  predefinedActivity.value = null;
};
</script>

<template>
  <dialog id="log_activity_modal" class="modal" @close="onClose">
    <div class="modal-box p-0">
      <header class="w-full px-8 py-4 flex justify-between items-center">
        <h3 class="text-lg font-bold">{{ editedActivity ? 'Update activity' : 'Log activity' }}</h3>
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>
        </form>
      </header>
      <div class="p-8 pt-2">
        <div>
          <label for="date" class="block font-medium">Date</label>
          <input
            v-model="selectedDate"
            type="date"
            max="today"
            class="input input-bordered w-full"
            :disabled="!!editedActivity"
          />
          <div class="flex justify-end mt-2">
            <button
              class="btn btn-ghost btn-sm text-blue-500"
              @click="setTodayDate"
              :disabled="selectedDate === dayjs().format('YYYY-MM-DD')"
            >
              Today
            </button>
          </div>
        </div>

        <div>
          <label for="date" class="block font-medium">Activity</label>
          <select class="select select-bordered w-full" v-model="selectedActivity">
            <option disabled selected>Select Activity</option>
            <option v-for="{ _id, title } in activities" :key="_id" :value="_id">
              {{ title }}
            </option>
          </select>
        </div>

        <div class="mt-4">
          <label for="date" class="block font-medium">Duration (minutes)</label>
          <input
            v-model="duration"
            type="number"
            placeholder="0"
            class="input input-bordered w-full"
            :max="60 * 24"
            step="1"
          />
          <div class="flex justify-start mt-2">
            <button
              v-for="option in predefinedTimeOptions"
              :key="option"
              class="btn btn-ghost btn-sm text-blue-500"
              @click="duration = option"
            >
              {{ option }}
            </button>
          </div>
        </div>

        <div v-if="editedActivity" class="mt-8 flex justify-end gap-4">
          <button class="btn btn-primary mt-2 rounded-xl w-24" @click="onLogActivity">Save</button>
          <button class="btn btn-primary mt-2 rounded-xl btn-neutral" @click="onDeleteLogActivity">
            Delete
          </button>
        </div>

        <div v-else class="mt-8 flex justify-center">
          <button class="btn btn-primary mt-2 w-full rounded-xl" @click="onLogActivity">
            Log activity
          </button>
        </div>
      </div>
    </div>
  </dialog>
</template>
