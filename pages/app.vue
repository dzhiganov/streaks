<script setup>
import { useRouter } from 'vue-router';

const { getSession } = useAuth();
const userSession = ref({});

const router = useRouter();

definePageMeta({
  auth: {
    unauthenticatedOnly: false,
    navigateUnauthenticatedTo: '/',
  },
  middleware: 'check-trial',
});

const route = useRoute();

onMounted(async () => {
  const session = await getSession();
  userSession.value = session?.user ?? {};
});

onMounted(() => {
  if (route.path === '/app') {
    router.push('/app/dashboard');
  }
});

onMounted(() => {
  const homePage = document.querySelector('[data-testid="home-page"]');
  if (homePage) {
    window.location.reload();
  }
});
</script>

<template>
  <div class="flex">
    <div class="overflow-auto w-full">
      <NuxtPage />
    </div>
  </div>
</template>
