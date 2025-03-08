<script setup>
import { ChatIcon, LogoutIcon, SettingsIcon, StarIcon } from '@/assets/icons';

const { signOut, getSession } = useAuth();
const userSession = ref({});
const theme = ref('light');

const user = ref({});

onMounted(async () => {
  const session = await getSession();
  user.value = session?.user ?? {};
});

const showUpgradeOption = computed(() => {
  if (!user.value) return false;
  return user.value?.subscription?.plan !== 'pro';
});

onBeforeMount(() => {
  theme.value = localStorage.getItem('theme');
});

onMounted(async () => {
  const session = await getSession();
  userSession.value = session?.user ?? {};
});

const changeTheme = () => {
  const newVal = theme.value === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', newVal);
  theme.value = newVal;
};

watch(
  theme,
  (v) => {
    document.documentElement.dataset.theme = v;
  },
  { immediate: true, deep: true },
);

const themes = ['system', 'light', 'dark'];
</script>
<template>
  <header
    class="ml-auto rounded-xl w-fit flex justify-between items-center text-base-content py-2 col-span-2"
  >
    <slot />
    <div class="flex items-center gap-2">
      <label class="swap swap-rotate">
        <input type="checkbox" class="theme-controller" @change="changeTheme" />
      </label>
      <div class="flex items-center gap-2 dropdown dropdown-bottom dropdown-end">
        <div class="avatar btn btn-sm m-1 btn-ghost btn-circle" tabindex="0" role="button">
          <div class="w-10 rounded-full">
            <img alt="user photo" :src="userSession?.image ?? ''" />
          </div>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content rounded-box z-[1] mt-3 w-52 p-2 shadow main-card bg-base-100 gap-3"
        >
          <li
            v-if="showUpgradeOption"
            class="font-semibold bg-accent rounded-lg text-accent-content"
          >
            <span onclick="upgrade_modal.showModal()">
              <StarIcon class="h-4 w-4" />
              Upgrade Now
            </span>
          </li>
          <li>
            <span onclick="settings_modal.showModal()">
              <SettingsIcon class="h-4 w-4" />
              Settings
            </span>
          </li>
          <li>
            <NuxtLink to="/support">
              <ChatIcon class="h-4 w-4" />
              Support
            </NuxtLink>
          </li>
          <li @click="signOut">
            <span>
              <LogoutIcon class="h-4 w-4" />
              Logout
            </span>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>
