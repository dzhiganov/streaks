<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { PauseIcon, PlayIcon, SettingsIcon, SquareIcon } from '~/assets/icons';
import { useGetActivities, useLogActivity } from '~/services/activity.service';
import { formatTime } from '~/utils/time/formatTime';

const durationInSeconds = ref(0);
const timerInterval = ref(null);
const isTimerRunning = ref(false);
const selectedActivity = ref(null);
const showNotification = ref(null);
const timePassed = ref(0);

const { data: activitiesData } = useGetActivities();
const { mutate: logActivity } = useLogActivity(() => {
  showNotification.value = 'Activity logged';
});

watch(showNotification, () => {
  if (showNotification.value) {
    setTimeout(() => {
      showNotification.value = null;
    }, 3000);
  }
});

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

const startStopwatch = () => {
  if (isTimerRunning.value || (!selectedActivity.value && mode.value === 'stopwatch')) return;

  isTimerRunning.value = true;
  const interval = 1000; // 1 second
  let startTime = Date.now();

  const tick = () => {
    if (!isTimerRunning.value) return;

    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - startTime) / interval);

    // Update the timer value based on elapsed time
    if (mode.value === 'stopwatch') {
      durationInSeconds.value += elapsedTime;
    } else {
      durationInSeconds.value -= elapsedTime;
      if (durationInSeconds.value <= 0) {
        durationInSeconds.value = 0;
        stopTimer();
        playCompletionSound();
        return;
      }
    }

    // Reset startTime for the next tick and account for any drift
    startTime += elapsedTime * interval;

    // Schedule the next tick
    timerInterval.value = setTimeout(tick, interval - (currentTime - startTime));
  };

  // Start the first tick
  timerInterval.value = setTimeout(tick, interval);
};

const startTimer = () => {
  if (isTimerRunning.value || !selectedActivity.value) return;

  isTimerRunning.value = true;
  const interval = 1000; // 1 second
  let startTime = Date.now();
  let remainingTime = durationInSeconds.value;
  let timePassed_temp = 0;

  const tick = () => {
    if (!isTimerRunning.value) return;

    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - startTime) / interval);

    remainingTime -= elapsedTime;
    timePassed_temp += elapsedTime;

    if (remainingTime <= 0) {
      durationInSeconds.value = 0;
      timePassed.value = timePassed_temp;
      stopTimer();
      playCompletionSound();
      return;
    }

    durationInSeconds.value = remainingTime;

    startTime += elapsedTime * interval;

    timerInterval.value = setTimeout(tick, interval - (currentTime - startTime));
  };

  timerInterval.value = setTimeout(tick, interval);
};

const playCompletionSound = () => {
  if (audioRef.value) {
    audioRef.value.currentTime = 0;
    audioRef.value.play();
  }
};

const stopCompletionSound = () => {
  if (audioRef.value) {
    audioRef.value.pause();
  }
};

const pauseTimer = () => {
  isTimerRunning.value = false;
  clearTimeout(timerInterval.value);
  saveToLocalStorage();
};

const stopTimer = () => {
  isTimerRunning.value = false;
  clearTimeout(timerInterval.value);

  if (selectedActivity.value && (durationInSeconds.value > 0 || mode.value === 'timer')) {
    document.getElementById('confirm-save-modal').showModal();
  }
  saveToLocalStorage();
  stopCompletionSound();
};

const handleSaveTimer = () => {
  logActivity({
    activity: selectedActivity.value,
    time_hours:
      mode.value === 'stopwatch'
        ? (durationInSeconds.value / 3600).toFixed(2)
        : (timePassed.value / 3600).toFixed(2),
  });
  updateDurationForMode();
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

watch(activities, () => {
  if (activities.value.length > 0) {
    selectedActivity.value = activities.value[0]._id;
  }
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

const closeModal = () => {
  document.getElementById('confirm-save-modal').close();
  stopCompletionSound();
  updateDurationForMode();
};
</script>

<template>
  <div class="max-w-md mx-auto rounded-lg relative">
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
        :disabled="
          (mode === 'stopwatch' && (isTimerRunning || durationInSeconds > 0)) ||
          (mode === 'timer' && isTimerRunning)
        "
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
        @click="
          () => {
            if (mode === 'stopwatch') {
              startStopwatch();
            } else {
              startTimer();
            }
          }
        "
        :disabled="isTimerRunning || !selectedActivity"
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
        :disabled="!durationInSeconds || !isTimerRunning"
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
    </div>

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
          <button @click="closeSettings" class="btn btn-ghost rounded-xl">Cancel</button>
          <button @click="saveSettings" class="btn btn-primary rounded-xl">Save</button>
        </div>
      </div>
    </div>

    <audio ref="audioRef" src="/audio/alarm.mp3"></audio>
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

  <dialog id="confirm-save-modal" class="modal">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <h3 class="text-2xl font-bold">Save logged time in history?</h3>
      <p class="py-2 pt-8">
        Activity:
        <span class="font-bold">{{
          activities.find((a) => a._id === selectedActivity)?.title
        }}</span>
      </p>
      <p class="py-2">
        Time:
        <span class="font-bold">{{
          formatTime({ seconds: mode === 'stopwatch' ? durationInSeconds : timePassed })
        }}</span>
      </p>
      <div class="modal-action flex justify-end">
        <form method="dialog" class="flex gap-4 mt-4">
          <button
            class="btn btn-primary px-6 py-2 rounded-xl shadow-md hover:bg-primary-dark transition duration-300"
            @click="handleSaveTimer"
          >
            Yes
          </button>
          <button
            class="btn btn-ghost px-6 py-2 rounded-xl shadow-md hover:bg-primary-dark transition duration-300"
            @click="closeModal"
          >
            No
          </button>
        </form>
      </div>
    </div>
  </dialog>
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
