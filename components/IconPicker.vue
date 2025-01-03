<script setup lang="ts">    
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'
import { MinusIcon } from '@/assets/icons'
import { CrossIcon } from '@/assets/icons'

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits(['update:modelValue']);

function onSelectIcon(emoji: { r: string }) {
  emit('update:modelValue', emoji.r);
}
</script>

<template>
    <label>Icon</label>  
    <div class="dropdown dropdown-right">
  <div tabindex="0" role="button" class="btn">
    <p v-if="modelValue" class="text-sm text-gray-500">
      {{ String.fromCodePoint(parseInt(modelValue, 16)) }}
    </p>
    <p v-else class="text-gray-400">
        <MinusIcon />
    </p>
  </div>
  <div
    tabindex="0"
    class="card compact dropdown-content bg-base-100 rounded-box z-[1] w-64 shadow">
    <div tabindex="0" class="card-body">
        <EmojiPicker :native="true" @select="onSelectIcon" />
    </div>
</div>

</div>

<button class="btn" @click="emit('update:modelValue', '')">
   <CrossIcon />
  </button>
  </template>

