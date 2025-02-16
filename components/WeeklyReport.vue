<template>
  <dialog id="weekly_report_modal" class="modal">
    <div class="modal-box">
      <div class="max-w-md mx-auto p-4">
        <div v-if="isFetching" class="text-neutral">Loading...</div>
        <div v-else-if="error" class="text-neutral">Failed to load report!</div>

        <div v-else-if="report" class="space-y-4">
          <div class="p-4 pt-0 rounded-md text-center">
            <p
              class="text-neutral text-2xl font-semibold text-center flex items-center gap-2 justify-center"
            >
              <AwardIcon class="w-6 h-6" />
              <span>Weekly Report</span>
            </p>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-neutral">Overall Activity</h2>
              <p class="text-xs text-neutral">
                ({{ report.dateRangeCurrent.start }} - {{ report.dateRangeCurrent.end }})
              </p>
            </div>
            <div class="text-right">
              <div>
                <span class="text-2xl font-bold mr-2"> {{ overallHours }}</span>
              </div>
              <div>
                <span
                  class="text-sm font-medium"
                  :class="overallDiffHours >= 0 ? 'text-green-600' : 'text-red-600'"
                >
                  {{ overallDiffHours >= 0 ? '+' : '' }}{{ overallDiffHours }}%
                </span>
                <span class="text-xs text-neutral"> vs. prev week</span>
              </div>
              <p class="text-xs text-neutral">
                ({{ report.dateRangePrevious.start }} - {{ report.dateRangePrevious.end }})
              </p>
            </div>
          </div>

          <div class="divider"></div>

          <div>
            <h3 class="text-lg font-semibold text-neutral mb-2">Top 3 Activities</h3>
            <ul class="space-y-2">
              <li
                v-for="(activity, index) in topActivities"
                :key="activity.activityId"
                class="flex items-center justify-between"
              >
                <span class="font-medium text-neutral"
                  >{{ index + 1 }}. {{ activity.activityName }}</span
                >
                <div class="flex items-center">
                  <span class="mr-2 font-semibold">
                    {{ formatTime({ minutes: activity.totalMin }, { short: true }) }}
                  </span>
                  <span
                    v-if="activityDiff(activity.activityId) !== null"
                    class="text-sm font-medium"
                    :class="
                      activityDiff(activity.activityId) >= 0 ? 'text-green-600' : 'text-red-600'
                    "
                  >
                    {{ activityDiff(activity.activityId) >= 0 ? '+' : ''
                    }}{{ activityDiff(activity.activityId) }}%
                  </span>
                </div>
              </li>
            </ul>
          </div>

          <div class="divider"></div>

          <!-- 3) Best / Worst Day -->
          <div class="flex justify-between items-center">
            <h3 class="text-sm font-semibold text-neutral">💪 Most Productive Day</h3>
            <span class="text-sm"> {{ bestDayName }} ({{ bestDayHours }} ) </span>
          </div>

          <div class="flex justify-between items-center">
            <h3 class="text-sm font-semibold text-neutral">😴 Least Productive Day</h3>
            <span class="text-sm"> {{ worstDayName }} ({{ worstDayHours }}) </span>
          </div>
        </div>
      </div>

      <div class="mt-8 flex justify-center">
        <button class="btn btn-neutral mt-2 min-w-32 rounded-xl" @click="onClose">Close</button>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { AwardIcon } from '~/assets/icons';
import { useGetReport } from '~/services/activity.service';
import { formatTime } from '~/utils/time/formatTime';

const props = defineProps<{
  from: string;
  to: string;
}>();

const { from, to } = toRefs(props);

const isOpen = ref(false);

const {
  data: fetched,
  error,
  isFetching,
} = useGetReport({
  enabled: isOpen,
  from: from,
  to: to,
});

const report = ref<any>(null);
const stopObserving = ref<() => void>(() => {});

const observeDialog = (el: HTMLElement, callback: (isOpen: boolean) => void) => {
  const observer = new MutationObserver(() => {
    callback(el.open);
  });

  observer.observe(el, {
    attributes: true,
    attributeFilter: ['open'],
  });

  return () => {
    observer.disconnect();
  };
};

onMounted(() => {
  const dialog = document.getElementById('report_modal');
  if (dialog) {
    stopObserving.value = observeDialog(dialog, (v) => {
      isOpen.value = v;
    });
  }
});

onUnmounted(() => {
  stopObserving.value();
});

// Whenever our fetch returns new data, store it in "report"
watchEffect(() => {
  if (fetched.value?.report) {
    report.value = fetched.value.report;
  }
});

// Convert total minutes → hours (rounded)
function minutesToHours(minutes: number): number {
  return Math.round(minutes / 60);
}

// Overall hours = total current-week minutes → hours
const overallHours = computed(() => {
  if (!report.value) return 0;
  return formatTime({ minutes: report.value.overallPerformance || 0 }, { short: true });
});

// Overall difference in hours vs. last week
const overallDiffHours = computed(() => {
  if (!report.value) return 0;
  const diffMin = Math.round(report.value.comparison?.overallDifferencePercentage ?? 0);
  return diffMin;
});

// Sort and slice top 3 activities by total minutes
const topActivities = computed(() => {
  if (!report.value?.performanceByActivity) return [];
  return [...report.value.performanceByActivity]
    .sort((a, b) => b.totalMin - a.totalMin)
    .slice(0, 3);
});

// Find the difference in hours for a specific activity
function activityDiff(activityId: string): number | null {
  // Make sure we have a report
  if (!report.value) return null;

  // 1) Find current week's minutes for this activity
  const currentItem = report.value.performanceByActivity.find(
    (a: any) => a.activityId === activityId,
  );
  if (!currentItem) return null;
  const currentWeekMin = currentItem.totalMin;

  // 2) Find difference from comparison array
  const found = report.value.comparison?.activityDifferences?.find(
    (d: any) => d.activityId === activityId,
  );
  if (!found) return null;

  // differenceMin = currentWeekMin - previousWeekMin
  const differenceMin = found.differenceMin;

  // 3) Calculate previous week's minutes
  const previousWeekMin = currentWeekMin - differenceMin;

  // Avoid division by zero
  if (previousWeekMin <= 0) {
    // You can decide how to handle if previousWeekMin was 0
    // For example, return null or 100 (∞% difference)
    return null;
  }

  // 4) Compute the % difference
  // e.g. differenceMin=60, previousWeekMin=240 => (60/240)*100 => +25
  const diffPercent = (differenceMin / previousWeekMin) * 100;

  // Round or format as needed
  return Math.round(diffPercent);
}

// Best day name (e.g. "Monday") + hours
const bestDayName = computed(() => {
  if (!report.value) return '';
  const dateStr = report.value.bestDay?.date;
  return dateStr ? dayjs(dateStr).format('dddd') : '';
});

const bestDayHours = computed(() => {
  if (!report.value) return 0;
  return formatTime({ minutes: report.value.bestDay?.totalMin || 0 }, { short: true });
});

// Worst day name + hours
const worstDayName = computed(() => {
  if (!report.value) return '';
  const dateStr = report.value.worstDay?.date;
  return dateStr ? dayjs(dateStr).format('dddd') : '';
});

const worstDayHours = computed(() => {
  if (!report.value) return 0;
  return formatTime({ minutes: report.value.worstDay?.totalMin || 0 }, { short: true });
});

const onClose = () => {
  document.getElementById('report_modal')?.close();
};
</script>
