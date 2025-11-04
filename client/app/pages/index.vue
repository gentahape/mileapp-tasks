<script setup lang="ts">
  import { ref } from 'vue';

  useHead({
    title: 'Login'
  });

  const config = useRuntimeConfig();
  const authToken = useAuthToken();
  const router = useRouter();

  const email = ref('');
  const password = ref('');

  const errorMsg = ref<string | null>(null);
  const isLoading = ref(false);

  const handleLogin = async () => {
    if (isLoading.value) return;

    isLoading.value = true;
    errorMsg.value = null;

    try {
      const { data, error } = await useFetch(`${config.public.apiBaseUrl}/login`, {
        method: 'POST',
        body: {
          email: email.value,
          password: password.value
        }
      });

      if (error.value) {
        errorMsg.value = error.value?.message || 'An unknown error occurred';
        isLoading.value = false;
        return;
      }

      if (data.value) {
        authToken.value = (data.value as any).token;
        await router.push('/tasks');
      }
    } catch (error) {
      errorMsg.value = 'An unexpected error occurred';
    } finally {
      isLoading.value = false;
    }
  }
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-200 px-4">
    <div class="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-xl">
      
      <div class="text-center">
        <h1 class="text-4xl font-extrabold mb-4"><span class="text-blue-500">mile</span><span class="text-orange-500">app</span></h1>
        
        <h2 class="text-3xl font-bold text-gray-900">
          Login to Your Account
        </h2>
        <p class="mt-2 text-base text-gray-600">
          Welcome to MileApp Tasks
        </p>
      </div>

      <form class="space-y-6" @submit.prevent="handleLogin">

        <div v-if="errorMsg" class="rounded-md bg-red-100 p-3 text-sm text-red-700">
          {{ errorMsg }}
        </div>
        
        <div>
          <label for="email" class="block text-sm font-medium text-gray-900">
            Email
          </label>
          <div class="mt-1">
            <input 
              id="email" 
              name="email" 
              type="email" 
              autocomplete="email" 
              autofocus
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="your@email.com"
              v-model="email"
            >
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-900">
            Password
          </label>
          <div class="mt-1">
            <input 
              id="password" 
              name="password" 
              type="password" 
              autocomplete="current-password" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="••••••••"
              v-model="password"
            >
          </div>
        </div>

        <div>
          <button 
            type="submit" 
            class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 transition duration-150 ease-in-out"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Loading...' : 'Login' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>