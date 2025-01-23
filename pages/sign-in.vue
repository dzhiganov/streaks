<script setup>
import { GoogleIcon } from '../assets/icons';

definePageMeta({
  middleware: ['auth'],
});

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/app',
  },
});

const { signIn } = useAuth();
</script>
<template>
  <div class="h-screen w-full">
    <div class="card mx-auto w-96 shadow-md flex justify-center flex-col gap-4 mt-16 p-6">
      <div class="flex flex-col gap-8 w-full justify-center items-center">
        <button @click="signIn('google')" class="btn w-full btn-primary">
          <GoogleIcon />
          Sign in with Google
        </button>
      </div>
      <div class="text-center mt-4">
        By proceeding, you agree to the
        <NuxtLink class="link-primary" href="/tos">Terms of Service</NuxtLink> and
        <NuxtLink class="link-primary" href="/privacy-policy">Privacy Notice</NuxtLink>.
      </div>
    </div>
  </div>
</template>
