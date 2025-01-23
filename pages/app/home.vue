<script setup>
import 'cally';
import dayjs from 'dayjs';
import { ref } from 'vue';
import { CrossIcon, EditIcon } from '~/assets/icons';
import IconPicker from '~/components/IconPicker.vue';
import TimeGoal from '~/components/TimeGoal.vue';
import {
  useAddActivity,
  useAddActivityType,
  useGetActivities,
  useGetActivityTypes,
  useGetHistoryByRange,
  useLogActivity,
  useUpdateActivity,
} from '~/services/activity.service';
import { getIcon } from '~/utils/getIcon';

const OWL_EMOJI_CODE_POINT = `1f989`;
const DEFAULT_ACTIVITY_COLOR = `Forest Green`;

const today = new Date().toISOString().split('T')[0];
const selectedDate = ref(today);
const duration = ref();
const selectedActivity = ref(1);
const activityId = ref('');
const activityTitle = ref('');
const activityDescription = ref('');
const activityType = ref('');
const activityIcon = ref(OWL_EMOJI_CODE_POINT);
const activityColor = ref(DEFAULT_ACTIVITY_COLOR);
const activityWeekTimeGoal = ref(0);
const activityDayTimeGoal = ref(0);
const activityMonthTimeGoal = ref(0);

const showNotification = ref(null);

watch(showNotification, () => {
  if (showNotification.value) {
    setTimeout(() => {
      showNotification.value = null;
    }, 3000);
  }
});

const selectRandomColor = () => {
  const randomColor = colors[Math.floor(Math.random() * colors.length)].value;
  activityColor.value = randomColor;
};

onMounted(() => {
  selectRandomColor();
});

const newActivityType = ref({
  title: '',
  description: '',
});

const { data: activitiesData, refetch: refetchActivities } = useGetActivities({ onlyActive: true });
const { data: activityTypesData } = useGetActivityTypes();
const { mutate: addNewActivity } = useAddActivity(() => {
  refetchActivities();
});
const { mutate: addNewType } = useAddActivityType();
const { mutate: logActivity } = useLogActivity();
const { mutate: updateActivity } = useUpdateActivity(() => {
  refetchActivities();
});

const activityTypes = computed(() => activityTypesData?.value?.activity_types || []);
const activities = computed(() => activitiesData?.value?.activities || []);

const getActivityDiff = (oldActivity, newActivity) => {
  const diff = {};

  Object.keys(newActivity).forEach((key) => {
    if (oldActivity[key] !== newActivity[key] && key !== '_id') {
      diff[key] = newActivity[key];
    }
  });

  return diff;
};

const onSaveActivity = async () => {
  if (!activityId.value) {
    addNewActivity({
      title: activityTitle.value,
      description: activityDescription.value,
      type: activityType.value,
      icon: activityIcon.value,
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
          icon: activityIcon.value,
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
  activityIcon.value = OWL_EMOJI_CODE_POINT;
  activityColor.value = DEFAULT_ACTIVITY_COLOR;
  activityWeekTimeGoal.value = 0;
  activityDayTimeGoal.value = 0;
  activityMonthTimeGoal.value = 0;

  showNotification.value = 'Activity saved';
};

const onSaveActivityType = async () => {
  addNewType(newActivityType.value);
};

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

const onLogActivity = async () => {
  logActivity({
    activity: selectedActivity.value,
    time_hours: duration.value,
  });

  showNotification.value = 'Activity logged';
  duration.value = '';
};

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

const onEditActivity = (activity) => {
  document.getElementById('add_new_activity_modal').showModal();
  activityId.value = activity._id;
  activityTitle.value = activity.title;
  activityDescription.value = activity.description;
  activityType.value = activity.type;
  activityIcon.value = activity.icon;
  activityColor.value = activity.color;
  activityWeekTimeGoal.value = activity.week_time_goal_min ? activity.week_time_goal_min / 60 : 0;
  activityDayTimeGoal.value = activity.day_time_goal_min ? activity.day_time_goal_min / 60 : 0;
  activityMonthTimeGoal.value = activity.month_time_goal_min
    ? activity.month_time_goal_min / 60
    : 0;
};

const onDeleteActivity = () => {
  updateActivity({
    id: activityId.value,
    active: false,
  });
};

const getProgress = (timeGoal, timeRest) => {
  const res = 100 - (timeRest / timeGoal) * 100;
  return res;
};

const range = computed(() => getCurrentWeekRange());

const getCurrentWeekRange = () => {
  const today = dayjs();
  const monday = today.startOf('week').add(1, 'day');
  const sunday = monday.add(6, 'day').endOf('day');

  return {
    from: monday.format('YYYY-MM-DD'),
    to: sunday.format('YYYY-MM-DD'),
  };
};

const from = computed(() => range.value.from);
const to = computed(() => range.value.to);

const { data: historyData } = useGetHistoryByRange(from, to);

const history = computed(() => {
  const d = historyData?.value?.history || [];

  const res = [];

  Object.values(d).forEach((activities) => {
    Object.values(activities).forEach((activity) => {
      res.push({
        title: activity.title,
        color: activity.color,
        icon: activity.icon,
        sum_min: activity.sum_min,
      });
    });
  });

  return res.sort((a, b) => b.sum_min - a.sum_min).slice(0, 3);
});

const onClickDeleteButton = (activity) => {
  document.getElementById('confirm-delete-modal').showModal();
  activityId.value = activity._id;
};
</script>

<template>
  <div class="max-w-3xl w-full ml-12 mt-4">
    <h1 class="text-4xl font-bold mb-4 font-header">Activities</h1>
    <div class="flex gap-4 items-center bg-base-300 p-4 rounded-lg">
      <div class="text-lg font-bold">This week</div>
      <div v-if="history.length === 0" class="text-gray-500">No activities</div>
      <div v-else class="flex gap-4">
        <div v-for="activity in history" :key="activity.title" class="flex gap-2 items-center">
          <div
            class="w-10 h-10 flex items-center justify-center rounded-full shadow-lg shrink-0"
            :style="{ backgroundColor: activity.color }"
          >
            {{ getIcon(activity.icon, activity.title) }}
          </div>
          {{ (activity.sum_min / 60).toFixed(2) * 1 }} hours
        </div>
      </div>
    </div>
    <div class="max-w-4xl mx-auto mt-8 grid grid-cols-2 gap-6">
      <div class="main-card p-4 rounded-lg shadow">
        <h2 class="text-lg font-bold mb-4">Log Activity</h2>
        <div>
          <div>
            <label for="date" class="block font-medium">Date</label>
            <input
              v-model="selectedDate"
              type="date"
              placeholder="MM/DD/YYYY"
              max="today"
              class="input input-bordered w-full"
            />
          </div>

          <div class="mt-4">
            <label for="date" class="block font-medium">Activity</label>
            <select class="select select-bordered w-full" v-model="selectedActivity">
              <option disabled selected>Select Activity</option>
              <option v-for="{ _id, title } in activities" :key="_id" :value="_id">
                {{ title }}
              </option>
            </select>
          </div>

          <div class="mt-4">
            <label for="date" class="block font-medium">Duration (hours)</label>
            <input
              v-model="duration"
              type="number"
              placeholder="0"
              class="input input-bordered w-full"
              :max="60 * 24"
              step="0.5"
            />
          </div>

          <div class="mt-4 flex justify-center">
            <button class="btn btn-primary mt-2 w-full rounded-xl" @click="onLogActivity">
              Log activity
            </button>
          </div>
        </div>
      </div>

      <div class="main-card p-4 rounded-lg shadow">
        <Timer />
      </div>

      <div class="main-card p-4 rounded-lg shadow">
        <h2 class="text-lg font-bold mb-4">Goals</h2>
        <div v-if="activities.length === 0">
          <p class="text-gray-500">No activities</p>
        </div>
        <div v-else>
          <ul class="space-y-2">
            <li
              v-for="(activity, activityTitle) in activities"
              :key="activityTitle"
              class="group flex items-center p-2 rounded-lg hover:bg-base-200 dark:hover:bg-base-100 relative"
            >
              <div class="flex gap-4 items-center w-full">
                <div
                  class="w-10 h-10 flex items-center justify-center rounded-full shadow-lg shrink-0 text-white"
                  :style="{ backgroundColor: activity.color }"
                >
                  {{ getIcon(activity.icon, activity.title) }}
                </div>
                <div class="w-full overflow-hidden truncate">
                  <div>
                    <p class="w-full font-medium flex gap-2 w-full truncate">
                      {{ activity.title }}
                    </p>
                  </div>
                  <TimeGoal
                    v-if="activity.day_time_goal_min"
                    type="day"
                    :goalMinutes="activity.day_time_goal_min"
                    :restMinutes="activity.day_rest_time_min"
                  />
                  <TimeGoal
                    v-else-if="activity.week_time_goal_min"
                    type="week"
                    :goalMinutes="activity.week_time_goal_min"
                    :restMinutes="activity.week_rest_time_min"
                  />
                  <TimeGoal
                    v-else-if="activity.month_time_goal_min"
                    type="month"
                    :goalMinutes="activity.month_time_goal_min"
                    :restMinutes="activity.month_rest_time_min"
                  />
                  <div v-else>
                    <span>No goal</span>
                  </div>
                </div>
              </div>
              <div
                class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 bg-base-300 items-center p-2 rounded-lg"
              >
                <button class="icon-btn" @click="onEditActivity(activity)">
                  <EditIcon />
                </button>
                <button class="icon-btn" @click="onClickDeleteButton(activity)">
                  <CrossIcon />
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="main-card p-4 rounded-lg shadow">
        <h2 class="text-lg font-bold mb-4">Add New</h2>
        <button
          class="btn border-2 border-primary mb-2 w-full rounded-xl"
          onclick="add_new_activity_modal.showModal();"
        >
          + Activity
        </button>
        <button
          class="btn border-2 border-primary w-full rounded-xl"
          onclick="add_new_activity_type_modal.showModal();"
        >
          + Activity Type
        </button>
      </div>
    </div>

    <div class="mt-8 px-4">
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
                <label class="block text-gray-600 font-medium">Icon</label>
                <div class="rounded-md">
                  <IconPicker
                    :modelValue="activityIcon"
                    @update:modelValue="activityIcon = $event"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-gray-600 font-medium">{{ label }}</label>
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

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="space-y-2">
                  <label class="block text-gray-600 font-medium">Week Time Goal (hours)</label>
                  <input
                    v-model="activityWeekTimeGoal"
                    type="number"
                    step="0.5"
                    class="input input-bordered w-full rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div class="space-y-2">
                  <label class="block text-gray-600 font-medium">Day Time Goal (hours)</label>
                  <input
                    v-model="activityDayTimeGoal"
                    type="number"
                    step="0.5"
                    class="input input-bordered w-full rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div class="space-y-2">
                  <label class="block text-gray-600 font-medium">Month Time Goal (hours)</label>
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

      <dialog id="add_new_activity_type_modal" class="modal">
        <div class="modal-box p-0">
          <header class="w-full px-8 py-4 flex justify-between items-center">
            <h3 class="text-lg font-bold">Add New Activity Type</h3>
            <form method="dialog">
              <button class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>
            </form>
          </header>
          <div class="p-8 pt-2">
            <div class="mt-4 space-y-2 flex flex-col gap-4">
              <div class="space-y-2">
                <label class="block text-gray-600 font-medium">Title</label>
                <input
                  v-model="newActivityType.title"
                  type="text"
                  placeholder="Title"
                  class="input input-bordered w-full"
                />
              </div>

              <div class="space-y-2">
                <label class="block text-gray-600 font-medium">Description</label>
                <textarea
                  v-model="newActivityType.description"
                  class="textarea textarea-bordered w-full rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Description"
                ></textarea>
              </div>

              <div class="modal-action flex justify-end">
                <form method="dialog" class="flex gap-4 mt-4">
                  <button
                    class="btn btn-primary px-6 py-2 rounded-xl shadow-md hover:bg-primary-dark transition duration-300"
                    @click="onSaveActivityType"
                  >
                    Save
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </dialog>
      <dialog id="confirm-delete-modal" class="modal">
        <div class="modal-box">
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 class="text-lg font-bold">Delete</h3>
          <p class="py-4">Are you sure you want to delete this activity?</p>
          <p>
            Your activity progress will be saved in the history and you can restore activity later.
          </p>
          <div class="modal-action flex justify-end">
            <form method="dialog" class="flex gap-4 mt-4">
              <button
                class="btn btn-ghost px-6 py-2 rounded-xl shadow-md hover:bg-primary-dark transition duration-300"
                @click="onDeleteActivity(activity)"
              >
                Delete
              </button>
              <button
                class="btn btn-primary px-6 py-2 rounded-xl shadow-md hover:bg-primary-dark transition duration-300"
                @click="document.getElementById('confirm-delete-modal').close()"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  </div>

  <teleport to="body">
    <div
      v-if="showNotification"
      role="alert"
      class="alert alert-success absolute bottom-4 right-4 w-80"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{{ showNotification }}</span>
    </div></teleport
  >
</template>

<style scoped>
.icon-btn {
  @apply btn btn-ghost btn-xs;

  width: 30px;
  height: 30px;
  padding: 0.45rem;

  svg {
    width: 16px;
    height: 16px;
  }
}
</style>
