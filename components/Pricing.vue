<script setup>
const props = defineProps({
  theme: {
    type: String,
    default: 'dark',
    validator: (value) => ['light', 'dark'].includes(value),
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  features: {
    type: Array,
    required: true,
  },
  buttonText: {
    type: String,
    required: true,
  },
  isCurrentPlan: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const purchase = async () => {
  const data = await $fetch('/api/create-checkout-session', {
    method: 'POST',
    body: { packageId: 'lifetime' },
  });

  if (data.url) {
    window.location = data.url;
  }
};

const agree = ref(false);
</script>

<template>
  <div class="w-full max-w-96">
    <div class="flex flex-col rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10 relative">
      <h3 class="text-base/7 font-semibold text-indigo-400">{{ title }}</h3>
      <p class="mt-4">
        <span class="text-5xl font-semibold tracking-tight">€ 19.99</span>
      </p>
      <p class="mt-6 text-base/7">
        Get
        <span
          class="tooltip"
          data-tip="This is a one-time purchase for lifetime access, meaning you can use the app as long as
            it remains available. However, we cannot guarantee that the service will be maintained
            indefinitely, and we reserve the right to modify or discontinue it at any time. All
            purchases are final, and refunds are not possible."
        >
          <span class="font-semibold underline decoration-dashed">lifetime access</span>
        </span>
        with a one-time payment. No subscriptions, no recurring fees—just unlimited access forever.
      </p>

      <div class="mt-20">
        <div class="flex items-center gap-2">
          <input type="checkbox" class="checkbox checkbox-sm checkbox-primary" v-model="agree" />
          <div class="text-sm">
            I agree to the
            <NuxtLink class="link-primary" href="/tos">Terms of Service</NuxtLink> and
            <NuxtLink class="link-primary" href="/privacy-policy">Privacy Notice</NuxtLink>.
          </div>
        </div>

        <div>
          <button
            :disabled="!agree"
            @click="purchase"
            class="btn mt-4 block w-full rounded-md py-2.5 px-3.5 text-center text-sm focus-visible:outline-2 focus-visible:outline-offset-2 bg-indigo-500 text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-indigo-500"
          >
            Continue to payment
          </button>
          <p class="pt-2 text-[11px]">Applicable taxes will be calculated at checkout.</p>
        </div>
      </div>
    </div>
  </div>
</template>
