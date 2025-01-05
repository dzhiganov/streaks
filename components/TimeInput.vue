<template>
    <div class="time-input-container space-y-2 p-4 border rounded-md bg-gray-50">
      <label class="font-medium text-gray-600">Time (hh:mm)</label>
      <div class="relative flex items-center gap-1">
        <div class="relative">
          <input
            v-model="localHours"
            type="text"
            maxlength="2"
            placeholder="hh"
            @input="validateHours"
            class="input input-bordered w-16 text-center focus:ring-2 focus:ring-primary"
          />
          <span v-if="!localHours" class="absolute inset-0 flex items-center justify-center text-gray-400 text-sm pointer-events-none">__</span>
        </div>
  
        <div class="relative">
          <input
            v-model="localMinutes"
            type="text"
            maxlength="2"
            placeholder="mm"
            @input="validateMinutes"
            class="input input-bordered w-16 text-center focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, computed } from 'vue';
  
  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  // Split initial modelValue into hours and minutes
  const [initialHours, initialMinutes] = props.modelValue.split(':');
  
  const localHours = ref(initialHours || '');
  const localMinutes = ref(initialMinutes || '');
  
  // Validate Hours Input
  function validateHours() {
    localHours.value = localHours.value.replace(/\D/g, ''); // Allow only digits
    if (Number(localHours.value) > 23) localHours.value = '23';
    updateValue();
  }
  
  // Validate Minutes Input
  function validateMinutes() {
    localMinutes.value = localMinutes.value.replace(/\D/g, ''); // Allow only digits
    if (Number(localMinutes.value) > 59) localMinutes.value = '59';
    updateValue();
  }
  
  // Emit combined value when hours or minutes change
  function updateValue() {
    const hh = localHours.value.padStart(2, '0');
    const mm = localMinutes.value.padStart(2, '0');
    emit('update:modelValue', `${hh}:${mm}`);
  }
  
  // Watch for external changes to modelValue
  watch(
    () => props.modelValue,
    (newValue) => {
      const [hh, mm] = newValue.split(':');
      localHours.value = hh || '';
      localMinutes.value = mm || '';
    }
  );
  
  // Computed Formatted Time
  const formattedTime = computed(() => {
    const hh = localHours.value.padStart(2, '0');
    const mm = localMinutes.value.padStart(2, '0');
    return `${hh}:${mm}`;
  });
  </script>
  
  <style scoped>
  .time-input-container {
    max-width: 300px;
  }
  
  input[type='text']::-webkit-inner-spin-button,
  input[type='text']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  /* For consistent placeholder styling */
  .relative input::placeholder {
    color: transparent;
  }
  </style>
  