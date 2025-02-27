<script setup>
import { ChatIcon, LogoutIcon, StarIcon } from '@/assets/icons';

const { signOut, getSession } = useAuth();
const userSession = ref({});
const theme = ref('light');

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

const goToBeta = () => {
  window.location.href = '/beta';
};
</script>
<template>
  <header
    class="border-b border-neutral-content px-4 flex justify-between items-center text-base-content py-2 col-span-2 w-full"
  >
    <div class="flex items-center gap-2">
      <NuxtImg src="/favicon.svg" alt="FlowTracks" class="w-7 h-7" />
      <h1 class="text-lg font-bold font-header">FlowTracks</h1>
      <div class="badge badge-primary badge-sm cursor-pointer font-semibold" @click="goToBeta">
        Beta
      </div>
    </div>

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
          <li class="font-semibold bg-accent rounded-lg text-accent-content">
            <NuxtLink to="/upgrade">
              <StarIcon class="h-4 w-4" />
              Upgrade to PRO
            </NuxtLink>
          </li>
          <li>
            <span @click="changeTheme">
              <svg
                v-if="theme === 'light'"
                class="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
                  fill="currentColor"
                />
              </svg>

              <svg v-else class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
                  fill="currentColor"
                />
              </svg>
              {{ `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme` }}
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
