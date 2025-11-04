interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'progress' | 'done';
  createdAt: string;
}

interface Meta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

const tasks = ref<Task[]>([]);
const meta = ref<Meta | null>(null);
const loading = ref(false);

export const useTasks = () => {
  
  const getTasks = async (params: { 
    page: number; 
    status: string; 
    sortBy: string;
  }) => {
    loading.value = true;
    
    const [sortField, sortOrder] = params.sortBy.split(':');
    
    const queryParams: Record<string, string | any> = {
      page: params.page,
      limit: 10,
      sortBy: sortField,
      sortOrder: sortOrder
    };

    if (params.status && params.status !== 'all') {
      queryParams.status = params.status;
    }

    try {
      const data = await useApiFetch<{ data: Task[], meta: Meta }>('/tasks', {
        params: queryParams,
      });

      if (data) {
        tasks.value = data.data;
        meta.value = data.meta;
      }
    } catch (e) {
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const createTask = async (taskData: { 
    title: string; 
    description: string; 
    status: string; 
  }) => {
    try {
      await useApiFetch('/tasks', {
        method: 'POST',
        body: taskData,
      });
      await navigateTo('/tasks');
    } catch (e) {
      throw e;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await useApiFetch(`/tasks/${id}`, {
        method: 'DELETE',
      });
      tasks.value = tasks.value.filter(task => task._id !== id);
    } catch (e) {
      throw e;
    }
  };
  
  const getTaskById = async (id: string) => {
    try {
      const data = await useApiFetch<Task>(`/tasks/${id}`);
      return data;
    } catch (e) {
      throw e;
    }
  };
  
  const updateTask = async (id: string, taskData: Partial<Task>) => {
    try {
      await useApiFetch(`/tasks/${id}`, {
        method: 'PUT',
        body: taskData,
      });
      await navigateTo('/tasks');
    } catch (e) {
      throw e;
    }
  };

  return {
    tasks,
    meta,
    loading,
    getTasks,
    createTask,
    deleteTask,
    getTaskById,
    updateTask,
  };
};