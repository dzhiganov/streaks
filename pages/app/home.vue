<script setup>
import 'cally';
import { ref, watch } from 'vue';
import ActivityGraph from '~/components/ActivityGraph.vue';
import IconPicker from '~/components/IconPicker.vue';
import {
  useAddActivity,
  useAddActivityType,
  useGetActivities,
  useGetActivityTypes,
  useGetHistoryByDate,
  useLogActivity,
} from '~/services/activity.service';

const OWL_EMOJI_CODE_POINT = `1f989`;
const DEFAULT_ACTIVITY_COLOR = `Forest Green`;

const today = new Date().toISOString().split('T')[0];
const selectedDate = ref(today);
const showAddActivitySection = ref(false);
const duration = ref();
const selectedActivity = ref(1);
const newActivity = ref({
  title: '',
  description: '',
  type: '',
  icon: OWL_EMOJI_CODE_POINT,
  color: DEFAULT_ACTIVITY_COLOR,
  active: true,
  week_time_goal_hours: 0,
  day_time_goal_hours: 0,
  month_time_goal_hours: 0,
  created_at: new Date(),
});

const newActivityType = ref({
  title: '',
  description: '',
});

const showAddActivityTypeSection = ref(false);

const { data: activitiesData } = useGetActivities();
const { data: activityTypesData } = useGetActivityTypes();
const { mutate: addNewActivity } = useAddActivity();
const { mutate: addNewType } = useAddActivityType();
const { mutate: logActivity } = useLogActivity();

const activityTypes = computed(() => activityTypesData?.value?.activity_types || []);
const activities = computed(() => activitiesData?.value?.activities || []);

const onSaveActivity = async () => {
  addNewActivity(newActivity.value);
};

const onSaveActivityType = async () => {
  addNewType(newActivityType.value);
};

const colors = [
  { name: 'Bright Blue', value: '#007AFF' }, // Vivid and fresh blue
  { name: 'Teal Green', value: '#00C689' }, // Brighter teal
  { name: 'Sunset Orange', value: '#FF7043' }, // Warmer, punchier orange
  { name: 'Cool Gray', value: '#5F738E' }, // Slightly brighter gray
  { name: 'Blush Pink', value: '#FF6F91' }, // Brightened pink
  { name: 'Lush Green', value: '#4CAF50' }, // Brighter green
  { name: 'Vivid Purple', value: '#9C27B0' }, // Enhanced purple
  { name: 'Golden Yellow', value: '#FFC107' }, // Brighter golden yellow
  { name: 'Sky Blue', value: '#42A5F5' }, // Sky-like bright blue
  { name: 'Electric Cyan', value: '#00E5FF' }, // Eye-catching cyan
];

const onSelectColor = (color) => {
  newActivity.value.color = color;
};

const onLogActivity = async () => {
  logActivity({
    activity: selectedActivity.value,
    time_hours: duration.value,
  });
};

const { data: historyData = {} } = useGetHistoryByDate(selectedDate);

const currentDayHistory = computed(() => {
  return historyData?.value?.history || {};
});
</script>

<template>
  <div class="max-w-md mx-auto mt-8">
    <h1 class="text-2xl font-bold mb-4">Activities</h1>

    <div class="collapse collapse-arrow">
      <input type="checkbox" />
      <div class="collapse-title text-xl font-medium">Weekly Statistic</div>
      <div class="collapse-content">
        <ActivityGraph />
      </div>
    </div>

    <div class="mt-8 px-4 flex flex-col gap-4">
      <div class="space-y-2">
        <label for="date" class="block font-medium">Date</label>
        <input
          v-model="selectedDate"
          type="date"
          placeholder="MM/DD/YYYY"
          max="today"
          class="input input-bordered w-full"
        />
      </div>
      <h2 class="text-lg font-bold">Log Activity</h2>
      <div>
        <select class="select select-bordered w-full max-w-xs" v-model="selectedActivity">
          <option disabled selected>Select Activity</option>
          <option v-for="{ _id, title, icon } in activities" :key="_id" :value="_id">
            <p v-if="icon" class="text-sm">
              {{ String.fromCodePoint(parseInt(icon, 16)) }}
            </p>
            {{ title }}
          </option>
        </select>
        <input
          v-model="duration"
          type="number"
          placeholder="Duration (hours)"
          class="input input-bordered w-full mt-4 max-w-xs"
          :max="60 * 24"
        />
        <div class="flex justify-start">
          <button class="btn btn-primary mt-2 w-full max-w-xs" @click="onLogActivity">Save</button>
        </div>
      </div>
      <div>
        <h2 class="text-xl font-bold mt-8 mb-2">History</h2>
        <div v-if="Object.keys(currentDayHistory).length === 0">
          <p class="text-gray-500">No activities logged for this day.</p>
        </div>
        <div v-else>
          <div
            v-for="(activities, groupTitle) in currentDayHistory"
            :key="groupTitle"
            class="group mb-6"
          >
            <h3 class="text-lg font-semibold mb-2">{{ groupTitle }}</h3>

            <ul class="space-y-2 border-l-4 border-gray-300 pl-4">
              <li
                v-for="(activity, activityTitle) in activities"
                :key="activityTitle"
                class="history-entry flex items-center space-x-4"
              >
                <div
                  class="icon w-8 h-8 flex items-center justify-center rounded-full text-white"
                  :style="{ backgroundColor: activity.color }"
                >
                  {{ String.fromCodePoint(parseInt(activity.icon, 16)) }}
                </div>
                <div>
                  <p class="text-md font-medium">{{ activity.title }}</p>
                  <p class="text-sm text-gray-500">
                    Duration: {{ (activity.sum_min / 60).toFixed(2) * 1 }} hours
                  </p>
                  <p class="text-sm text-gray-500">{{ activity.description }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 px-4">
      <h2 class="mt-8 mb-2 text-lg font-bold">Add new</h2>

      <div class="flex gap-4 items-center">
        <button class="btn" onclick="my_modal_1.showModal()">➕ Activity</button>
        <button class="btn" onclick="my_modal_2.showModal()">➕ Activity Type</button>
      </div>

      <dialog id="my_modal_1" class="modal">
        <div class="modal-box p-0">
          <header
            class="w-full px-8 py-4 flex justify-between items-center"
            :style="{ backgroundColor: `${newActivity.color ?? 'transparent'}` }"
          >
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
                  v-model="newActivity.type"
                  placeholder="Select Activity Type"
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
                  v-model="newActivity.title"
                  type="text"
                  placeholder="Enter Title"
                  class="input input-bordered w-full rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div class="space-y-2">
                <label class="block text-gray-600 font-medium">Description</label>
                <textarea
                  v-model="newActivity.description"
                  class="textarea textarea-bordered w-full rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Description"
                ></textarea>
              </div>

              <div class="space-y-2">
                <label class="block text-gray-600 font-medium">Icon</label>
                <div class="rounded-md">
                  <IconPicker
                    :modelValue="newActivity.icon"
                    @update:modelValue="newActivity.icon = $event"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-gray-600 font-medium">Color</label>
                <div class="p-3 rounded-md flex gap-2 items-center">
                  <button
                    v-for="color in colors"
                    :key="color.value"
                    @click="onSelectColor(color.value)"
                    :style="{ backgroundColor: color.value }"
                    class="w-8 h-8 rounded-full border-2 hover:border-gray-500"
                    :class="{ 'border-2 border-gray-500': newActivity.color === color.value }"
                  ></button>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="space-y-2">
                  <label class="block text-gray-600 font-medium">Week Time Goal (hours)</label>
                  <input
                    v-model="newActivity.week_time_goal_hours"
                    type="number"
                    placeholder="e.g., 10"
                    class="input input-bordered w-full rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div class="space-y-2">
                  <label class="block text-gray-600 font-medium">Day Time Goal (hours)</label>
                  <input
                    v-model="newActivity.day_time_goal_hours"
                    type="number"
                    placeholder="e.g., 2"
                    class="input input-bordered w-full rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div class="space-y-2">
                  <label class="block text-gray-600 font-medium">Month Time Goal (hours)</label>
                  <input
                    v-model="newActivity.month_time_goal_hours"
                    type="number"
                    placeholder="e.g., 40"
                    class="input input-bordered w-full rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div class="modal-action flex justify-end">
                <form method="dialog" class="flex gap-4 mt-4">
                  <button
                    class="btn btn-primary px-6 py-2 rounded-md shadow-md hover:bg-primary-dark transition duration-300"
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

      <dialog id="my_modal_2" class="modal">
        <div class="modal-box p-0">
          <header
            class="w-full px-8 py-4 flex justify-between items-center"
            :style="{ backgroundColor: `${newActivity.color ?? 'transparent'}` }"
          >
            <h3 class="text-lg font-bold">Add New Activity</h3>
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
                    class="btn btn-primary px-6 py-2 rounded-md shadow-md hover:bg-primary-dark transition duration-300"
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
    </div>
  </div>
</template>
