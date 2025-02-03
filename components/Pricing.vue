<script setup>
import { computed } from 'vue';

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
    type: Array,
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

const containerClass = computed(() =>
  props.theme === 'light'
    ? 'rounded-3xl p-8 ring-1 ring-gray-300 sm:p-10 relative bg-white shadow-2xl'
    : 'rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10 relative bg-gray-900 shadow-2xl',
);

const headerClass = computed(() =>
  props.theme === 'light'
    ? 'text-base font-semibold text-indigo-500'
    : 'text-base/7 font-semibold text-indigo-400',
);

const priceMainClass = computed(() =>
  props.theme === 'light'
    ? 'text-5xl font-semibold tracking-tight text-gray-900'
    : 'text-5xl font-semibold tracking-tight text-white',
);

const priceSubClass = computed(() =>
  props.theme === 'light' ? 'text-xl text-gray-600' : 'text-xl text-gray-400',
);

const descriptionClass = computed(() =>
  props.theme === 'light' ? 'mt-6 text-base text-gray-700' : 'mt-6 text-base/7 text-gray-300',
);

const featuresClass = computed(() =>
  props.theme === 'light'
    ? 'mt-8 space-y-3 text-sm text-gray-700 sm:mt-10'
    : 'mt-8 space-y-3 text-sm/6 sm:mt-10 text-gray-300',
);

const iconClass = computed(() =>
  props.theme === 'light'
    ? 'h-6 w-5 flex-none text-indigo-500'
    : 'h-6 w-5 flex-none text-indigo-400',
);
</script>

<template>
  <div class="w-1/2 max-w-96">
    <div :class="containerClass" class="flex flex-col">
      <h3 :class="headerClass">{{ title }}</h3>
      <p class="mt-4 flex items-baseline gap-x-2">
        <template v-if="price[1]">
          <span :class="priceMainClass">€ {{ price[0] }}</span>
          <span :class="priceSubClass">.{{ price[1] }}</span>
        </template>
        <template v-else>
          <span :class="priceMainClass">Free</span>
        </template>
      </p>
      <p :class="descriptionClass">{{ description }}</p>
      <ul role="list" :class="featuresClass">
        <li v-for="(feature, index) in features" :key="index" class="flex gap-x-3">
          <svg
            :class="iconClass"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            data-slot="icon"
          >
            <path
              fill-rule="evenodd"
              d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
              clip-rule="evenodd"
            ></path>
          </svg>
          {{ feature }}
        </li>
      </ul>
      <div class="mt-auto">
        <a
          v-if="!isCurrentPlan"
          href="#"
          aria-describedby="tier-enterprise"
          class="mt-8 block rounded-md py-2.5 px-3.5 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10 bg-indigo-500 text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-indigo-500"
        >
          {{ buttonText }}
        </a>
        <a
          v-else
          class="mt-8 block rounded-md py-2.5 px-3.5 text-center text-sm font-semibold focus-visible:outline-2 sm:mt-10 bg-gray-500 text-white shadow-xs"
        >
          Current plan
        </a>
      </div>
    </div>
  </div>
</template>
