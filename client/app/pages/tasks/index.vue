<script setup lang="ts">
  import { ref, watch, onMounted } from 'vue';

  definePageMeta({
    layout: 'admin'
  });
  useHead({
    title: 'Tasks'
  });

  const { tasks, meta, loading, getTasks, deleteTask } = useTasks();
  
  const selectedStatus = ref('all');
  const sortBy = ref('createdAt:desc');
  const currentPage = ref(1);

  const loadData = () => {
    getTasks({
      page: currentPage.value,
      status: selectedStatus.value,
      sortBy: sortBy.value
    });
  };

  onMounted(loadData);

  watch([selectedStatus, sortBy, currentPage], loadData);

  const formatDateTime = (isoString: string) => {
    if (!isoString) return 'No date';   
    const date = new Date(isoString);
    
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const changePage = (page: number) => {
    if (page > 0 && page <= (meta.value?.totalPages || 1)) {
      currentPage.value = page;
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
      if (tasks.value.length === 0 && currentPage.value > 1) {
        currentPage.value--;
      }
    }
  };

  const statusClass = (status: string) => {
    if (status === 'done') return 'bg-green-100 text-green-800';
    if (status === 'progress') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  }
</script>

<template>
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-3xl font-bold tracking-tight text-gray-500">
        My Tasks
      </h1>
      <NuxtLink 
        to="/tasks/create"
        class="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-600 transition-colors"
      >
        Create New Task
      </NuxtLink>
    </div>

    <div class="mb-6 grid grid-cols-1 gap-4 rounded-lg p-4 md:grid-cols-3 justify-center">
      
      <select 
        id="status" 
        v-model="selectedStatus"
        class="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="all">All Status</option>
        <option value="todo">Todo</option>
        <option value="progress">Progress</option>
        <option value="done">Done</option>
      </select>

      <select 
        id="sort"
        v-model="sortBy"
        class="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="createdAt:desc">Newest</option>
        <option value="createdAt:asc">Oldest</option>
        <option value="title:asc">Title (A-Z)</option>
      </select>
      
    </div>

    <div v-if="loading" class="text-center text-gray-500">Loading tasks...</div>

    <div v-if="!loading && tasks.length > 0" class="space-y-4">
      <div 
        v-for="task in tasks" 
        :key="task._id"
        class="flex items-center justify-between rounded-lg bg-gray-200 p-5 shadow"
      >
        <div>
          <span 
            :class="statusClass(task.status)"
            class="rounded-full px-3 py-1 text-xs font-medium"
          >
            {{ task.status }}
          </span>
          <h3 class="text-lg font-semibold text-gray-800">
            {{ task.title }}
          </h3>
          <p class="text-sm text-gray-700">
            {{ task.description }}
          </p>
          <p class="mt-1 text-xs text-gray-700">
            Created at: {{ formatDateTime(task.createdAt) }}
          </p>
        </div>

        <div class="flex items-center space-x-4">
          <NuxtLink 
            :to="`/tasks/${task._id}`"
            class="font-medium text-blue-500 hover:text-blue-600">
            Edit
          </NuxtLink>
          <button @click="handleDelete(task._id)" class="font-medium text-red-600 hover:text-red-800">
            Delete
          </button>
        </div>
      </div>

    </div>
    
    <div 
      v-if="!loading && tasks.length === 0"
      class="rounded-lg p-12 text-center"
    >
      <h3 class="text-xl font-medium text-gray-900">No tasks found</h3>
      <p class="mt-1 text-sm text-gray-500">
        Get started by creating a new task.
      </p>
    </div>
    
    <div v-if="meta && meta.totalPages > 1" class="mt-8 flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Page <span class="font-medium">{{ meta.currentPage }}</span> of <span class="font-medium">{{ meta.totalPages }}</span>
        </p>
      </div>
      <div class="flex space-x-2">
        <button
          @click="changePage(meta.currentPage - 1)"
          :disabled="meta.currentPage === 1"
          class="relative inline-flex items-center rounded-md border border-orange-300 bg-orange-500 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <button
          @click="changePage(meta.currentPage + 1)"
          :disabled="meta.currentPage === meta.totalPages"
          class="relative inline-flex items-center rounded-md border border-gray-300 bg-orange-500 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
    </div>
</template>