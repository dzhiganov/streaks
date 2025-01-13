<script setup>
import { ref } from 'vue';
import ActivityGraph from '~/components/ActivityGraph.vue';

const modes = [
  { key: 'year', label: 'Year' },
  { key: 'month', label: 'Month' },
  { key: 'week', label: 'Week' },
];
const currentMode = ref('month');
</script>

<template>
  <div>
    <h1>Statistics</h1>
    <div>
      <div class="flex gap-2 mb-4">
        <button
          v-for="mode in modes"
          :key="mode.key"
          @click="currentMode = mode.key"
          :class="['btn', currentMode === mode.key ? 'btn-primary' : 'btn-ghost']"
        >
          {{ mode.label }}
        </button>
      </div>
      <ActivityGraph :range="currentMode" />
    </div>
  </div>
</template>
