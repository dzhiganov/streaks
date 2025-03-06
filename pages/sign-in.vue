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
  <div
    data-theme="light"
    data-testid="sign-in-page"
    class="w-full h-screen bg-zinc-200 flex justify-center items-center"
  >
    <div class="w-fit mx-auto p-4 rounded-xl bg-base-300 shadow-lg -mt-32">
      <div class="flex flex-col items-center justify-center gap-2">
        <NuxtImg src="/favicon.svg" alt="Logo" class="w-16 h-16 mx-auto mt-16" />
        <h1 class="text-2xl font-bold font-header">FlowTracks</h1>
      </div>

      <div class="mx-auto w-96 flex justify-center flex-col gap-4 mt-12 p-6">
        <div class="flex flex-col gap-8 w-full justify-center items-center">
          <button @click="signIn('google')" class="btn w-full btn-neutral">
            <GoogleIcon />
            Continue with Google
          </button>
        </div>
        <div class="text-center mt-4 text-sm">
          By proceeding, you agree to the
          <NuxtLink class="link-primary" href="/tos">Terms of Service</NuxtLink> and
          <NuxtLink class="link-primary" href="/privacy-policy">Privacy Notice</NuxtLink>.
        </div>
      </div>
    </div>
  </div>
</template>
