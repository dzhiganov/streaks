<script setup>
import { useRouter } from 'vue-router';

const { signOut, data, getSession } = useAuth();
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
</script>

<template>
  <div class="flex">
    <div class="overflow-auto w-full">
      <NuxtPage />
    </div>
  </div>
</template>
