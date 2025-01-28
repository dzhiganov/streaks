<script setup>
import { CrossIcon, EditIcon } from '~/assets/icons';
import { useGetActivities } from '~/services/activity.service';
import { getRandomColor } from '~/utils/colors';

const OWL_EMOJI_CODE_POINT = `1f989`;
const DEFAULT_ACTIVITY_COLOR = getRandomColor();

const { data: activitiesData, refetch: refetchActivities } = useGetActivities({ onlyActive: true });

const activities = computed(() => activitiesData?.value?.activities || []);

const activityId = ref('');
const activityTitle = ref('');
const activityDescription = ref('');
const activityType = ref('');
const activityIcon = ref(OWL_EMOJI_CODE_POINT);
const activityColor = ref(DEFAULT_ACTIVITY_COLOR);
const activityWeekTimeGoal = ref(0);
const activityDayTimeGoal = ref(0);
const activityMonthTimeGoal = ref(0);

const selectRandomColor = () => {
  activityColor.value = getRandomColor();
};

onMounted(() => {
  selectRandomColor();
});

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

const onClickDeleteButton = (activity) => {
  document.getElementById('confirm-delete-modal').showModal();
  activityId.value = activity._id;
};

const onDeleteActivity = () => {
  updateActivity({
    id: activityId.value,
    active: false,
  });
};
</script>
<template>
  <div class="main-card p-4 rounded-lg shadow">
    <h2 class="text-lg font-bold mb-4">Week goals</h2>
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
              <EditIcon class="w-4 h-4" />
            </button>
            <button class="icon-btn" @click="onClickDeleteButton(activity)">
              <CrossIcon class="w-4 h-4" />
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <dialog id="confirm-delete-modal" class="modal">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <h3 class="text-lg font-bold">Delete</h3>
      <p class="py-4">Are you sure you want to delete this activity?</p>
      <p>Your activity progress will be saved in the history and you can restore activity later.</p>
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
</template>
