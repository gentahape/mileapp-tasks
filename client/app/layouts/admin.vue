<script setup lang="ts">
  const router = useRouter();
  const authToken = useAuthToken();

  const handleLogout = () => {
    authToken.value = undefined;
    router.push('/');
  }
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-blue-500 shadow-md">
      <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          
          <div class="flex-shrink-0">
            <NuxtLink to="/tasks">
              <h1 class="text-4xl font-extrabold text-white mb-4 mt-4">mileapp</h1>
            </NuxtLink>
          </div>

          <div>
            <button 
              @click="handleLogout"
              class="px-4 py-2 text-sm font-bold text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="py-10">
      <slot />
    </main>
  </div>
</template>