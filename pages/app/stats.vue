<script setup>
import { ref } from 'vue';
import ActivityGraph from '~/components/ActivityGraph.vue';


</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Statistics</h1>

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
      <ActivityGraph :range="currentMode" :show-options="true" />
    </div>
  </div>
</template>
