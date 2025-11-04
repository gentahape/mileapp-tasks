export const useApiFetch = async <T = any>(
  url: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
    params?: Record<string, any>;
    body?: any;
    headers?: HeadersInit;
  } = {}
): Promise<T> => {
  const config = useRuntimeConfig();
  const authToken = useAuthToken();

  const headers = new Headers(options.headers || {});
  if (authToken.value) {
    headers.set('Authorization', `Bearer ${authToken.value}`);
  }

  try {
    const response = await $fetch<T>(url, {
      baseURL: config.public.apiBaseUrl,
      headers,
      method: options.method || 'GET',
      params: options.params,
      body: options.body,
    });

    return response;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      authToken.value = undefined;
      await navigateTo('/');
    }

    throw error;
  }
};