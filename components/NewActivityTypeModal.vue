<script setup>
import { useAddActivityType } from '~/services/activity.service';

const title = ref('');
const description = ref('');

const { mutate: addNewType, isPending: isAddingType } = useAddActivityType();

const onSaveActivityType = async () => {
  addNewType({ title: title.value, description: description.value });
};

const isDisabled = computed(() => {
  if (!title.value) {
    return true;
  }
  return false;
});

const isLoading = computed(() => isAddingType.value);
</script>
<template>
  <dialog id="new_activity_type_modal" class="modal">
    <div class="modal-box p-0">
      <header class="w-full px-8 py-4 flex justify-between items-center">
        <h3 class="text-lg font-bold">Add New Activity Type</h3>
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>
        </form>
      </header>
      <div class="p-8 pt-2">
        <div class="mt-4 space-y-2 flex flex-col gap-4">
          <div class="space-y-2">
            <label class="block text-gray-600 font-medium">Title*</label>
            <input
              v-model="title"
              type="text"
              placeholder="Title"
              class="input input-bordered w-full"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-gray-600 font-medium">Description</label>
            <textarea
              v-model="description"
              class="textarea textarea-bordered w-full rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Description"
            ></textarea>
          </div>

          <div class="modal-action flex justify-end">
            <form method="dialog" class="flex gap-4 mt-4">
              <button
                class="btn btn-primary px-6 py-2 rounded-xl shadow-md hover:bg-primary-dark transition duration-300"
                @click="onSaveActivityType"
                :disabled="isDisabled"
              >
                <span v-if="isLoading" class="loading loading-spinner"></span>
                <span v-else>Save</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>
