export default defineNuxtRouteMiddleware((to, from) => {
  const token = useAuthToken();

  const protectedRoutes = ['/tasks', '/tasks/create'];
  
  const isProtectedRoute = protectedRoutes.some(route => to.path.startsWith(route));

  if (!token.value && isProtectedRoute) {
    return navigateTo('/');
  }

  if (token.value && to.path === '/') {
    return navigateTo('/tasks');
  }
});