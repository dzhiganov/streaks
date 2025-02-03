<script setup>
import {
  useAddActivity,
  useGetActivities,
  useGetActivityTypes,
  useUpdateActivity,
} from '~/services/activity.service';

const DEFAULT_ACTIVITY_COLOR = `Forest Green`;

const activityId = ref('');
const activityTitle = ref('');
const activityDescription = ref('');
const activityType = ref('');
const activityColor = ref(DEFAULT_ACTIVITY_COLOR);
const activityWeekTimeGoal = ref(0);
const activityDayTimeGoal = ref(0);
const activityMonthTimeGoal = ref(0);
const showNotification = ref(null);
const { data: activityTypesData } = useGetActivityTypes();
const selectedActivity = ref(1);

const { data: activitiesData, refetch: refetchActivities } = useGetActivities({ onlyActive: true });
const { mutate: addNewActivity } = useAddActivity(() => {
  refetchActivities();
});
const { mutate: updateActivity } = useUpdateActivity(() => {
  refetchActivities();
});

watch(showNotification, () => {
  if (showNotification.value) {
    setTimeout(() => {
      showNotification.value = null;
    }, 3000);
  }
});

const activityTypes = computed(() => activityTypesData?.value?.activity_types || []);
const activities = computed(() => activitiesData?.value?.activities || []);

const colors = [
  { name: 'Bright Blue', value: '#007AFF' },
  { name: 'Teal Green', value: '#00C689' },
  { name: 'Sunset Orange', value: '#FF7043' },
  { name: 'Cool Gray', value: '#5F738E' },
  { name: 'Blush Pink', value: '#FF6F91' },
  { name: 'Lush Green', value: '#4CAF50' },
  { name: 'Vivid Purple', value: '#9C27B0' },
  { name: 'Golden Yellow', value: '#FFC107' },
  { name: 'Sky Blue', value: '#42A5F5' },
  { name: 'Electric Cyan', value: '#00E5FF' },
];

const onSelectColor = (color) => {
  activityColor.value = color;
};

const getActivityDiff = (oldActivity, newActivity) => {
  const diff = {};

  Object.keys(newActivity).forEach((key) => {
    if (oldActivity[key] !== newActivity[key] && key !== '_id') {
      diff[key] = newActivity[key];
    }
  });

  return diff;
};

const selectRandomColor = () => {
  const randomColor = colors[Math.floor(Math.random() * colors.length)].value;
  activityColor.value = randomColor;
};

onMounted(() => {
  selectRandomColor();
});

const selectFirstActivity = () => {
  if (activities.value.length > 0) {
    selectedActivity.value = activities.value[0]._id;
  }
};

watch(
  activities,
  () => {
    selectFirstActivity();
  },
  { immediate: true },
);

const onSaveActivity = async () => {
  if (!activityId.value) {
    addNewActivity({
      title: activityTitle.value,
      description: activityDescription.value,
      type: activityType.value,
      color: activityColor.value,
      week_time_goal_hours: activityWeekTimeGoal.value,
      day_time_goal_hours: activityDayTimeGoal.value,
      month_time_goal_hours: activityMonthTimeGoal.value,
      active: true,
      created_at: new Date(),
    });
  } else {
    updateActivity({
      ...getActivityDiff(
        activities.value.find((activity) => activity._id === activityId.value),
        {
          _id: activityId.value,
          title: activityTitle.value,
          description: activityDescription.value,
          type: activityType.value,
          color: activityColor.value,
          week_time_goal_hours: activityWeekTimeGoal.value,
          day_time_goal_hours: activityDayTimeGoal.value,
          month_time_goal_hours: activityMonthTimeGoal.value,
        },
      ),
      id: activityId.value,
    });
  }

  activityId.value = null;
  activityTitle.value = '';
  activityDescription.value = '';
  activityType.value = '';
  activityColor.value = DEFAULT_ACTIVITY_COLOR;
  activityWeekTimeGoal.value = 0;
  activityDayTimeGoal.value = 0;
  activityMonthTimeGoal.value = 0;

  showNotification.value = 'Activity saved';
};

const onEditActivity = (activity) => {
  document.getElementById('add_new_activity_modal').showModal();
  activityId.value = activity._id;
  activityTitle.value = activity.title;
  activityDescription.value = activity.description;
  activityType.value = activity.type;
  activityColor.value = activity.color;
  activityWeekTimeGoal.value = activity.week_time_goal_min ? activity.week_time_goal_min / 60 : 0;
  activityDayTimeGoal.value = activity.day_time_goal_min ? activity.day_time_goal_min / 60 : 0;
  activityMonthTimeGoal.value = activity.month_time_goal_min
    ? activity.month_time_goal_min / 60
    : 0;
};
</script>
<template>
  <dialog
    id="add_new_activity_modal"
    class="modal"
    @close="
      () => {
        activityId = null;
      }
    "
  >
    <div class="modal-box p-0">
      <header class="w-full px-8 py-4 flex justify-between items-center">
        <h3 class="text-lg font-bold">Add New Activity</h3>
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>
        </form>
      </header>
      <div class="p-8 pt-2">
        <div class="mt-4 space-y-2 flex flex-col gap-4">
          <div class="space-y-2">
            <label for="activityType" class="block font-medium">Activity Type</label>
            <select
              class="select select-bordered w-full"
              v-model="activityType"
              placeholder="Select Activity Type"
              :disabled="Boolean(activityId)"
            >
              <option disabled selected>Select Activity Type</option>
              <option v-for="{ _id, title } in activityTypes" :key="_id" :value="_id">
                {{ title }}
              </option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="block text-gray-600 font-medium">Title</label>
            <input
              v-model="activityTitle"
              type="text"
              placeholder="Enter Title"
              class="input input-bordered w-full rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              :disabled="Boolean(activityId)"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-gray-600 font-medium">Description</label>
            <textarea
              v-model="activityDescription"
              class="textarea textarea-bordered w-full rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Description"
            ></textarea>
          </div>

          <div class="space-y-2">
            <label class="block text-gray-600 font-medium">Color</label>
            <div class="p-3 rounded-md flex gap-2 items-center">
              <button
                v-for="color in colors"
                :key="color.value"
                @click="onSelectColor(color.value)"
                :style="{
                  backgroundColor: color.value,
                }"
                :class="{
                  'relative after:content-[\'\'] after:absolute after:inset-[-4px] after:rounded-full after:border-2 after:border-accent-content':
                    activityColor === color.value,
                }"
                class="w-8 h-8 rounded-full"
              ></button>
            </div>
          </div>

          <h3 class="text-lg font-bold">Time Goals</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="space-y-2">
              <label class="block text-gray-600 font-medium">Day, hours</label>
              <input
                v-model="activityDayTimeGoal"
                type="number"
                step="0.5"
                class="input input-bordered w-full rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-gray-600 font-medium">Week, hours</label>
              <input
                v-model="activityWeekTimeGoal"
                type="number"
                step="0.5"
                class="input input-bordered w-full rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-gray-600 font-medium">Month, hours</label>
              <input
                v-model="activityMonthTimeGoal"
                type="number"
                class="input input-bordered w-full rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                step="0.5"
              />
            </div>
          </div>
          <div class="modal-action flex justify-end">
            <form method="dialog" class="flex gap-4 mt-4">
              <button
                class="btn btn-primary px-6 py-2 rounded-xl shadow-md hover:bg-primary-dark transition duration-300"
                @click="onSaveActivity"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>
