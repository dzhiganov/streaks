<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { MusicIcon, PauseIcon, PlayIcon, SquareIcon } from '~/assets/icons';
import { useGetActivities, useLogActivity } from '~/services/activity.service';

const durationInSeconds = ref(0);
const timerInterval = ref(null);
const isTimerRunning = ref(false);
const selectedActivity = ref(null);

const { data: activitiesData } = useGetActivities();
const { mutate: logActivity } = useLogActivity();

const activities = computed(() => activitiesData?.value?.activities || []);

const formattedTime = computed(() => {
  const hours = Math.floor(durationInSeconds.value / 3600);
  const minutes = Math.floor((durationInSeconds.value % 3600) / 60);
  const seconds = durationInSeconds.value % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const progressPercentage = computed(() => {
  const maxDuration = 3600; // 1 hour max for progress
  return Math.min((durationInSeconds.value / maxDuration) * 100, 100);
});

// Save state to localStorage
const saveToLocalStorage = () => {
  localStorage.setItem(
    'activityTimer',
    JSON.stringify({
      durationInSeconds: durationInSeconds.value,
      selectedActivity: selectedActivity.value,
      isTimerRunning: isTimerRunning.value,
    }),
  );
};

// Restore state from localStorage
const restoreFromLocalStorage = () => {
  const savedState = JSON.parse(localStorage.getItem('activityTimer'));
  if (savedState) {
    durationInSeconds.value = savedState.durationInSeconds || 0;
    selectedActivity.value = savedState.selectedActivity || null;
    isTimerRunning.value = false; // Always start paused on reload
  }
};

const startTimer = () => {
  if (isTimerRunning.value || !selectedActivity.value) return;
  isTimerRunning.value = true;
  timerInterval.value = setInterval(() => {
    durationInSeconds.value++;
  }, 1000);
};

const pauseTimer = () => {
  isTimerRunning.value = false;
  clearInterval(timerInterval.value);
  saveToLocalStorage();
};

const stopTimer = () => {
  isTimerRunning.value = false;
  clearInterval(timerInterval.value);
  if (selectedActivity.value && durationInSeconds.value > 0) {
    logActivity({
      activity: selectedActivity.value,
      time_hours: (durationInSeconds.value / 3600).toFixed(2),
    });
  }
  durationInSeconds.value = 0;
  saveToLocalStorage();
};

// Watch for changes in duration and periodically save to localStorage
watch(
  [durationInSeconds, selectedActivity],
  () => {
    saveToLocalStorage();
  },
  { deep: true },
);

// Restore state on mount
onMounted(() => {
  restoreFromLocalStorage();

  // Pause the timer when the page is about to unload
  window.addEventListener('beforeunload', pauseTimer);
});

// Clean up event listeners on unmount
onUnmounted(() => {
  window.removeEventListener('beforeunload', pauseTimer);
  clearInterval(timerInterval.value);
});

const audioRef = ref(null); // Reference to the audio element
const isTrackPlaying = ref(false); // State for track playback

const toggleTrackPlayback = () => {
  if (!audioRef.value) return;

  if (isTrackPlaying.value) {
    audioRef.value.pause();
    isTrackPlaying.value = false;
  } else {
    audioRef.value.play();
    isTrackPlaying.value = true;
  }
};

const cancelTimer = () => {
  isTimerRunning.value = false;
  clearInterval(timerInterval.value);
  durationInSeconds.value = 0;
  localStorage.removeItem('activityTimer');
};
</script>

<template>
  <div class="max-w-md mx-auto rounded-lg main-card">
    <h2 class="text-lg font-bold mb-4 text-center">Activity Timer</h2>

    <div class="mb-4">
      <select
        class="select select-bordered w-full max-w-xs mx-auto dark:select-primary"
        v-model="selectedActivity"
        :disabled="isTimerRunning || durationInSeconds > 0"
      >
        <option disabled selected>Select Activity</option>
        <option v-for="{ _id, title } in activities" :key="_id" :value="_id">
          {{ title }}
        </option>
      </select>
    </div>

    <div class="relative w-40 h-40 mx-auto">
      <div class="absolute rounded-full"></div>
      <div
        class="absolute inset-4 flex items-center justify-center rounded-full bg-base-300 shadow-md transition-all duration-300"
        :class="{ 'border-4 border-primary': isTimerRunning }"
      >
        <p class="text-2xl font-bold text-base-content">{{ formattedTime }}</p>
      </div>
    </div>

    <div class="flex w-full relative">
      <div class="flex justify-center gap-4 items-center absolute bottom-0 left-0">
        <button
          class="btn btn-circle btn-sm"
          :class="{ 'btn-primary': isTrackPlaying, 'btn-neutral': !isTrackPlaying }"
          @click="cancelTimer"
        >
          ✕
        </button>
      </div>

      <div class="flex justify-center gap-4 mt-6 mx-auto">
        <button
          class="btn btn-primary"
          :class="{ 'btn-disabled': isTimerRunning }"
          @click="startTimer"
          :disabled="isTimerRunning"
        >
          <PlayIcon />
        </button>
        <button
          class="btn btn-warning"
          :class="{ 'btn-disabled': !isTimerRunning }"
          @click="pauseTimer"
          :disabled="!isTimerRunning"
        >
          <PauseIcon />
        </button>
        <button
          class="btn btn-danger"
          :class="{ 'btn-disabled': !durationInSeconds }"
          @click="stopTimer"
          :disabled="!durationInSeconds"
        >
          <SquareIcon />
        </button>

        <div class="flex justify-center gap-4 items-center absolute bottom-0 right-0">
          <button
            class="btn btn-circle btn-sm"
            :class="{ 'btn-primary': isTrackPlaying, 'btn-neutral': !isTrackPlaying }"
            @click="toggleTrackPlayback"
          >
            <MusicIcon />
          </button>
        </div>
      </div>
    </div>

    <p v-if="!selectedActivity" class="text-sm text-center text-gray-500 mt-4 dark:text-gray-400">
      Please select an activity to start the timer.
    </p>
  </div>
</template>

<style scoped>
.select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn > svg {
  width: 16px;
  height: 16px;
}
</style>
