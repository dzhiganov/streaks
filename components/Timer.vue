<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { PauseIcon, PlayIcon, SettingsIcon, SquareIcon } from '~/assets/icons';
import { useGetActivities, useLogActivity } from '~/services/activity.service';

const durationInSeconds = ref(0);
const timerInterval = ref(null);
const isTimerRunning = ref(false);
const selectedActivity = ref(null);

const { data: activitiesData } = useGetActivities();
const { mutate: logActivity } = useLogActivity();

const activities = computed(() => activitiesData?.value?.activities || []);

const mode = ref('stopwatch');
const customDuration = ref({ hours: 0, minutes: 25, seconds: 0 });
const isSettingsOpen = ref(false);

const updateDurationForMode = () => {
  if (mode.value === 'stopwatch') {
    durationInSeconds.value = 0;
  } else {
    durationInSeconds.value =
      (customDuration.value.hours || 0) * 3600 +
      (customDuration.value.minutes || 0) * 60 +
      (customDuration.value.seconds || 0);
  }
};

const formattedTime = computed(() => {
  const hours = Math.floor(durationInSeconds.value / 3600);
  const minutes = Math.floor((durationInSeconds.value % 3600) / 60);
  const seconds = durationInSeconds.value % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const saveToLocalStorage = () => {
  localStorage.setItem(
    'activityTimer',
    JSON.stringify({
      durationInSeconds: durationInSeconds.value,
      selectedActivity: selectedActivity.value,
      isTimerRunning: isTimerRunning.value,
      mode: mode.value,
      customDuration: customDuration.value,
    }),
  );
};

const restoreFromLocalStorage = () => {
  const savedState = JSON.parse(localStorage.getItem('activityTimer'));
  if (savedState) {
    durationInSeconds.value = savedState.durationInSeconds || 0;
    selectedActivity.value = savedState.selectedActivity || null;
    mode.value = savedState.mode || 'stopwatch';
    customDuration.value = savedState.customDuration || { hours: 0, minutes: 25, seconds: 0 };
    isTimerRunning.value = false;
  }
};

const startTimer = () => {
  if (isTimerRunning.value || (!selectedActivity.value && mode.value === 'stopwatch')) return;

  isTimerRunning.value = true;
  timerInterval.value = setInterval(() => {
    if (mode.value === 'stopwatch') {
      durationInSeconds.value++;
    } else {
      if (durationInSeconds.value > 0) {
        durationInSeconds.value--;
      } else {
        stopTimer();
      }
    }
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
  updateDurationForMode(); // Reset to initial state
  saveToLocalStorage();
};

const toggleMode = (v) => {
  mode.value = v;
  updateDurationForMode();
  saveToLocalStorage();
};

const openSettings = () => {
  isSettingsOpen.value = true;
};

const closeSettings = () => {
  isSettingsOpen.value = false;
};

const saveSettings = () => {
  updateDurationForMode();
  saveToLocalStorage();
  closeSettings();
};

watch(
  [durationInSeconds, selectedActivity],
  () => {
    saveToLocalStorage();
  },
  { deep: true },
);

onMounted(() => {
  restoreFromLocalStorage();
  updateDurationForMode();

  window.addEventListener('beforeunload', pauseTimer);
});

onUnmounted(() => {
  window.removeEventListener('beforeunload', pauseTimer);
  clearInterval(timerInterval.value);
});

const audioRef = ref(null);
const isTrackPlaying = ref(false);

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
  <div class="max-w-md mx-auto rounded-lg main-card relative">
    <div role="tablist" class="tabs tabs-boxed mb-6">
      <button
        role="tab"
        class="tab"
        :class="{ 'tab-active': mode === 'stopwatch' }"
        @click="toggleMode('stopwatch')"
      >
        Stopwatch
      </button>
      <button
        role="tab"
        class="tab"
        :class="{ 'tab-active': mode === 'timer' }"
        @click="toggleMode('timer')"
      >
        Timer
      </button>
    </div>

    <div class="mb-4 flex justify-center items-center">
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
      <div
        class="absolute inset-4 flex items-center justify-center rounded-full bg-base-300 shadow-md transition-all duration-300"
        :class="{ 'border-4 border-primary': isTimerRunning }"
      >
        <p class="text-2xl font-bold text-base-content">{{ formattedTime }}</p>
      </div>
    </div>

    <div class="flex justify-center gap-4 mt-6">
      <div class="flex justify-center gap-4 items-center absolute bottom-2 left-0">
        <button class="btn btn-circle btn-sm" @click="cancelTimer">✕</button>
      </div>

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

      <div class="flex justify-center gap-4 items-center absolute bottom-2 right-0">
        <button
          @click="openSettings"
          class="btn btn-circle btn-sm"
          :class="{ 'btn-disabled': mode !== 'timer' }"
        >
          <SettingsIcon />
        </button>
      </div>

      <!-- <audio controls ref="audioRef" loop volume="0.4">
        <source src="/audio/bg-music.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div class="flex justify-center gap-4 items-center absolute bottom-0 right-0">
        <button
          class="btn btn-circle btn-sm"
          :class="{ 'btn-primary': isTrackPlaying, 'btn-neutral': !isTrackPlaying }"
          @click="toggleTrackPlayback"
        >
          <MusicIcon />
        </button>
      </div> -->
    </div>

    <!-- Settings Modal -->
    <div v-if="isSettingsOpen" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Timer Settings</h3>
        <div class="mt-4">
          <label class="block font-medium mb-2">Hours:</label>
          <input
            v-model.number="customDuration.hours"
            type="number"
            class="input input-bordered w-full"
            min="0"
          />
          <label class="block font-medium mb-2 mt-4">Minutes:</label>
          <input
            v-model.number="customDuration.minutes"
            type="number"
            class="input input-bordered w-full"
            min="0"
            max="59"
          />
          <label class="block font-medium mb-2 mt-4">Seconds:</label>
          <input
            v-model.number="customDuration.seconds"
            type="number"
            class="input input-bordered w-full"
            min="0"
            max="59"
          />
        </div>
        <div class="modal-action">
          <button @click="closeSettings" class="btn btn-ghost">Cancel</button>
          <button @click="saveSettings" class="btn btn-primary">Save</button>
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
