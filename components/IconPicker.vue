<script setup lang="ts">
import { MinusIcon } from '@/assets/icons';
import EmojiPicker from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';

defineProps<{
  modelValue: string;
}>();

const emit = defineEmits(['update:modelValue']);

function onSelectIcon(emoji: { r: string }) {
  emit('update:modelValue', emoji.r);
}
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="dropdown dropdown-right">
      <div tabindex="0" role="button" class="btn">
        <p v-if="modelValue" class="text-sm text-gray-500 text-xl">
          {{ String.fromCodePoint(parseInt(modelValue, 16)) }}
        </p>
        <p v-else class="text-gray-400">
          <MinusIcon />
        </p>
      </div>
      <div
        tabindex="0"
        class="card compact dropdown-content bg-base-100 rounded-box z-[1] w-64 shadow"
      >
        <div tabindex="0" class="card-body">
          <EmojiPicker :native="true" @select="onSelectIcon" />
        </div>
      </div>
    </div>

    <button class="btn btn-ghost btn-circle btn-sm" @click="emit('update:modelValue', '')">
      ✕
    </button>
  </div>
</template>
