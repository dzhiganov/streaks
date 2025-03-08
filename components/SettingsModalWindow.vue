<script setup>
import { ArrowLeft, ControlsIcon, CreditCardIcon, StarIcon } from '@/assets/icons';
import Pricing from '@/components/Pricing.vue';
import dayjs from 'dayjs';
import { onBeforeMount, ref, watch } from 'vue';

const { getSession } = useAuth();

const subscriptionPlan = ref({ type: 'trial', endDate: '2025-04-01' });

onMounted(async () => {
  const session = await getSession();

  if (session?.user?.subscription) {
    const sub = session?.user?.subscription;

    subscriptionPlan.value = {
      type: sub.lifetime ? 'lifetime' : sub.plan,
      endDate: sub.expiresAt,
      lifetime: sub.lifetime,
      trialExpiresAt: sub.trialExpiresAt,
    };
  }
});

const showUpgradeOptions = ref(false);

const themes = ['system', 'light', 'dark'];
const categories = [
  {
    title: 'Application',
    Icon: ControlsIcon,
  },
  {
    title: 'Subscription',
    Icon: CreditCardIcon,
  },
];
const selectedCategory = ref('Application');

const theme = ref('light');

onBeforeMount(() => {
  theme.value = localStorage.getItem('theme') || 'system';
});

const changeTheme = (event) => {
  const newTheme = event.target.value;
  localStorage.setItem('theme', newTheme);
  theme.value = newTheme;
};

watch(
  theme,
  (v) => {
    if (v === 'system') {
      updateSystemTheme();
    } else {
      document.documentElement.dataset.theme = v;
    }
  },
  { immediate: true },
);

const updateSystemTheme = () => {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
};

onBeforeMount(() => {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateSystemTheme);
});

const upgradeToLifetime = () => {
  showUpgradeOptions.value = true;
};
</script>

<template>
  <dialog id="settings_modal" class="modal">
    <div
      class="modal-box w-full max-w-lg p-6 rounded-lg shadow-lg bg-white dark:bg-gray-900 min-h-[400px] min-w-[600px]"
    >
      <header
        class="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-4 mb-4"
      >
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Settings</h3>
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost dark:text-white">✕</button>
        </form>
      </header>

      <div class="flex">
        <aside class="w-1/3 border-r border-gray-200 dark:border-gray-800 pr-4">
          <ul class="space-y-2">
            <li
              v-for="{ title: category, Icon } in categories"
              :key="category"
              @click="selectedCategory = category"
              class="cursor-pointer px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
              :class="
                selectedCategory === category
                  ? 'bg-gray-200 dark:bg-gray-800 font-medium'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              "
            >
              <component :is="Icon" class="h-4 w-4" />
              {{ category }}
            </li>
          </ul>
        </aside>

        <main class="w-2/3 pl-4">
          <div v-if="selectedCategory === 'Application'">
            <h4 class="text-lg font-medium mb-2 text-gray-800 dark:text-white">Theme</h4>
            <div class="relative">
              <select
                class="w-full p-2 border border-gray-200 dark:border-gray-800 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                :value="theme"
                @change="changeTheme"
              >
                <option v-for="v in themes" :key="v" :value="v">
                  {{ v.charAt(0).toUpperCase() + v.slice(1) }}
                </option>
              </select>
            </div>
          </div>

          <div v-if="selectedCategory === 'Subscription'">
            <div v-if="showUpgradeOptions">
              <button @click="showUpgradeOptions = false" class="btn btn-sm btn-ghost">
                <ArrowLeft class="h-4 w-4" />
                Back
              </button>
              <div class="mt-4">
                <Pricing />
              </div>
            </div>

            <div v-else>
              <h4 class="text-lg font-medium mb-2 text-gray-800 dark:text-white">
                Subscription Plan
              </h4>

              <div class="p-4 rounded-md border bg-gray-50 dark:bg-gray-800">
                <p class="text-gray-700 dark:text-gray-300">
                  <span class="font-semibold">Plan: </span>
                  <span class="capitalize">{{ subscriptionPlan.type }}</span>
                </p>

                <p
                  v-if="subscriptionPlan.type === 'trial'"
                  class="text-gray-700 dark:text-gray-300 mt-1"
                >
                  <span class="font-semibold">Expires on:</span>
                  {{ dayjs(subscriptionPlan.trialExpiresAt).format('MMM D, YYYY') }}
                  <span class="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    ({{ dayjs(subscriptionPlan.trialExpiresAt).diff(dayjs(), 'days') }} days left)
                  </span>
                </p>
              </div>

              <div
                v-if="subscriptionPlan.type === 'trial'"
                class="p-4 rounded-md flex justify-center items-center mt-4"
              >
                <button @click="upgradeToLifetime" class="btn btn-primary btn-sm">
                  <StarIcon class="h-4 w-4" />
                  Upgrade to Lifetime — Limited Offer
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </dialog>
</template>
