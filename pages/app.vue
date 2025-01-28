<script setup>
import { ActivityIcon, GraphIcon } from '@/assets/icons';
import { useRouter } from 'vue-router';

const { signOut, data, getSession } = useAuth();
const userSession = ref({});

const router = useRouter();

definePageMeta({
  auth: {
    unauthenticatedOnly: false,
    navigateUnauthenticatedTo: '/',
  },
});

const route = useRoute();

onMounted(async () => {
  const session = await getSession();
  userSession.value = session?.user ?? {};
});

const isActive = (path) => route.path === path;

const navLinks = [
  { title: 'Activities', path: '/app/home', icon: ActivityIcon },
  { title: 'Statistics', path: '/app/stats', icon: GraphIcon },
  // { title: 'Settings', path: '/app/settings', icon: SettingsIcon, disabled: true },
];

onMounted(() => {
  if (route.path === '/app') {
    router.push('/app/home');
  }
});

const isDrawerOpen = ref(false);

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value;
};
</script>

<template>
  <div class="flex">
    <div class="overflow-auto w-full">
      <NuxtPage />
    </div>
  </div>
</template>
