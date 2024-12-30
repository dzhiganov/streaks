<script setup>
import { GoogleIcon } from '../assets/icons'

definePageMeta({
    middleware: ['auth']
})

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/app'
  }
})

const { signIn } = useAuth()
</script>
<template>
    <div class="card mx-auto w-96 shadow-md flex justify-center flex-col gap-4 mt-16 bg-base-200 p-6">
      <div class="flex flex-col gap-8 w-full justify-center items-center">
        <button color="white" text-color="black" label="" @click="signIn('google')" no-caps class="btn w-full btn-neutral">
          <span class="button-text">
            <GoogleIcon />
            Sign in with Google
          </span>
        </button>
      </div>
      <div class="text-center mt-4">
        By proceeding, you agree to the <NuxtLink class="link-primary" href="/tos">Terms of Service</NuxtLink> and <NuxtLink class="link-primary" href="/privacy-policy">Privacy Notice</NuxtLink>.
      </div>

    </div>  
</template>
