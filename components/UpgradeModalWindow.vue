<script setup>
import Pricing from '~/components/Pricing.vue';
</script>

<template>
  <dialog id="upgrade_modal" class="modal">
    <div class="modal-box w-fit">
      <header class="w-full px-8 py-4 flex justify-between items-center">
        <h3 class="text-2xl font-bold">Pay Once, Access Forever</h3>
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>
        </form>
      </header>
      <Pricing />
    </div>
  </dialog>
</template>
