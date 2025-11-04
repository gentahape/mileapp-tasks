export const useAuthToken = () => {
  return useCookie<string | undefined>('auth_token', {
    maxAge: 60 * 60,
    sameSite: 'lax',
  });
}