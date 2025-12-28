export const tokenStorage = {
  getAccessToken: () => typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  setAccessToken: (token: string) => typeof window !== 'undefined' && localStorage.setItem('token', token),
  removeAccessToken: () => typeof window !== 'undefined' && localStorage.removeItem('token'),
};