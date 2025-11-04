<script setup lang="ts">
  import { ref, onMounted } from 'vue';

  definePageMeta({
    layout: 'admin',
  });
  useHead({
    title: 'Edit Task'
  });

  const { getTaskById, updateTask } = useTasks();
  const route = useRoute();

  const form = ref<any>(null);
  const isLoading = ref(true);
  const isSubmitting = ref(false);
  const errorMsg = ref<string | null>(null);

  const taskId = route.params.id as string;

  onMounted(async () => {
    const dataTask = await getTaskById(taskId);

    if (dataTask) {
      form.value = {
        title: dataTask.title,
        description: dataTask.description,
        status: dataTask.status
      };
    } else {
      errorMsg.value = 'Failed to fetch task';
    }

    isLoading.value = false;
  });

  const handleUpdate = async () => {
    if (!form.value) return;

    isSubmitting.value = true;
    errorMsg.value = null;

    try {
      await updateTask(taskId, form.value);
    } catch (error: any) {
      errorMsg.value = error.data?.message || 'Failed to update task';
    } finally {
      isSubmitting.value = false;
    }
  }
</script>

<template>
  <div class="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
    
    <h1 class="mb-8 text-3xl font-bold tracking-tight text-gray-900">
      Edit Task
    </h1>

    <div v-if="isLoading" class="text-center text-gray-500">Loading task...</div>
    
    <div v-if="errorMsg" class="rounded-md bg-red-100 p-3 text-sm text-red-700">
      {{ errorMsg }}
    </div>

    <form 
      v-if="form"
      @submit.prevent="handleUpdate"
      class="space-y-6 rounded-xl bg-white p-8 shadow-lg"
    >
      
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input 
          type="text" 
          v-model="form.title"
          id="title" 
          required
          autofocus
          placeholder="Input title here..."
          class="mt-1 block w-full rounded-lg border-0 bg-gray-100 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea 
          id="description" 
          v-model="form.description"
          rows="4"
          placeholder="Input description here..."
          class="mt-1 block w-full rounded-lg border-0 bg-gray-100 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
        ></textarea>
      </div>
      
      <div>
        <label for="status" class="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select 
          id="status"
          v-model="form.status"
          class="mt-1 block w-full rounded-lg border-0 bg-gray-100 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option>todo</option>
          <option>progress</option>
          <option>done</option>
        </select>
      </div>

      <div class="flex justify-end space-x-4 border-t border-gray-200 pt-6">
        <NuxtLink
          to="/tasks"
          class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Cancel
        </NuxtLink>
        <button 
          type="submit"
          :disabled="isSubmitting"
          class="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          {{ isSubmitting ? 'Loading...' : 'Update Task' }}
        </button>
      </div>
    </form>
  </div>
</template>