<script setup>
import { ref } from 'vue';

const agree = ref(false);

const purchase = async () => {
  const data = await $fetch('/api/create-checkout-session', {
    method: 'POST',
    body: { packageId: 'lifetime' },
  });

  if (data.url) {
    window.location = data.url;
  }
};
</script>

<template>
  <div class="mx-auto max-w-sm flex flex-col gap-4">
    <!-- Lifetime Plan (Active) -->
    <div
      class="relative rounded-xl border-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-950 p-4 shadow-sm"
    >
      <span class="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Lifetime Plan</span>
      <div class="mt-1 text-xl font-bold text-gray-900 dark:text-white">€19.99</div>
      <p class="mt-2 text-xs text-gray-700 dark:text-gray-300">
        One-time payment for
        <span
          class="tooltip"
          data-tip="Lifetime access means unlimited use as long as the service remains available. We reserve the right to modify or discontinue the service. All sales final."
        >
          <span class="font-semibold underline decoration-dashed">lifetime access</span> </span
        >. No recurring fees.
      </p>

      <!-- Limited-time Badge -->
      <span
        class="absolute -top-2 right-3 bg-accent text-white text-[10px] px-2 py-0.5 rounded-full"
      >
        Limited Offer
      </span>

      <div class="mt-4 flex items-start gap-2">
        <input
          type="checkbox"
          class="checkbox checkbox-xs checkbox-primary mt-0.5"
          v-model="agree"
        />
        <div class="text-[11px] text-gray-700 dark:text-gray-300">
          I agree to the
          <NuxtLink class="link-primary" href="/tos">Terms of Service</NuxtLink> and
          <NuxtLink class="link-primary" href="/privacy-policy">Privacy Notice</NuxtLink>.
        </div>
      </div>

      <button :disabled="!agree" @click="purchase" class="btn btn-primary btn-sm mt-4 w-full">
        Continue to Payment
      </button>
      <p class="mt-1 text-[10px] text-gray-500 dark:text-gray-400">Taxes calculated at checkout.</p>
    </div>

    <!-- Monthly Subscription (Disabled) -->
    <div
      class="relative rounded-xl border border-gray-300 dark:border-gray-700 p-4 opacity-60 cursor-not-allowed"
    >
      <span class="text-sm font-semibold text-gray-900 dark:text-gray-200">Monthly Plan</span>
      <div class="mt-1 text-xl font-bold text-gray-900 dark:text-white">€5.99/mo</div>
      <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
        Pay monthly, cancel anytime. Perfect for flexibility.
      </p>
      <button class="btn btn-disabled mt-4 w-full btn-sm">Coming Soon</button>
      <span class="absolute top-2 right-2 bg-gray-200 dark:bg-gray-700 text-xs px-2 py-0.5 rounded">
        Soon
      </span>
    </div>
  </div>
</template>
