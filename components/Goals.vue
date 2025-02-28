<script setup>
import { CrossIcon, EditIcon, GoalIcon } from '~/assets/icons';
import { useGetActivities } from '~/services/activity.service';

const { data: activitiesData } = useGetActivities({ onlyActive: true });

const activities = computed(() => activitiesData?.value?.activities || []);

const emits = defineEmits(['editActivity']);

const activityId = ref('');

const onEditActivity = (activity) => {
  emits('editActivity', activity);
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
  <div class="px-2 py-4 rounded-lg bg-base-300">
    <h2 class="text-lg font-bold mb-4 flex items-center gap-2 px-2">
      <GoalIcon class="w-5 h-5" />
      Goals
    </h2>
    <div v-if="activities.length === 0">
      <p class="text-gray-500 text-sm">
        No activities. Goals will be shown here after you add some activities.
      </p>
    </div>
    <div v-else>
      <ul class="space-y-2">
        <li
          v-for="(activity, activityTitle) in activities"
          :key="activityTitle"
          class="group flex items-center p-2 rounded-lg hover:bg-base-200 dark:hover:bg-base-100 relative"
        >
          <div class="flex gap-4 items-center w-full">
            <div class="w-full overflow-hidden truncate">
              <TimeGoal
                v-if="activity.day_time_goal_min"
                type="day"
                :activityTitle="activity.title"
                :goalMinutes="activity.day_time_goal_min"
                :restMinutes="activity.day_rest_time_min"
              />
              <TimeGoal
                v-else-if="activity.week_time_goal_min"
                type="week"
                :activityTitle="activity.title"
                :goalMinutes="activity.week_time_goal_min"
                :restMinutes="activity.week_rest_time_min"
              />
              <TimeGoal
                v-else-if="activity.month_time_goal_min"
                type="month"
                :activityTitle="activity.title"
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
