<script setup>
import Pricing from '~/components/Pricing.vue';

const props = defineProps({
  isPro: {
    type: Boolean,
    required: true,
  },
});

const options = computed(() => {
  return [
    {
      id: 'basic',
      title: 'Basic',
      price: ['Free', ''],
      description: 'Lifetime access to the app*',
      features: ['Up to 10 activities per day', 'Up to 3 categories', 'Customer support'],
      theme: 'light',
    },
    {
      id: 'pro',
      title: 'Pro Plan',
      price: [19, 99],
      description: 'Lifetime access to the app*',
      features: [
        'Unlimited activities history',
        'Unlimited activity types and categories',
        'Customization',
        'Multiple Visual data representations',
        'Customer support',
        'Export data to CSV',
      ],
      theme: 'dark',
    },
  ];
});
</script>

<template>
  <div class="flex flex-col gap-8 mt-24">
    <h2 class="text-4xl mb-4 font-semibold text-center">Upgrade to Pro to get more features</h2>
    <div class="flex justify-center gap-8 items-center">
      <Pricing
        v-for="option in options"
        :key="option.title"
        :title="option.title"
        :price="option.price"
        :description="option.description"
        :features="option.features"
        buttonText="Get started today"
        :theme="option.theme"
        :isCurrentPlan="option.id === 'basic'"
      />
    </div>
  </div>
</template>
