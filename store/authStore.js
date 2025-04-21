// store/authStore.js
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  role: null,
  username: null,
  token: null,

  setAuth: ({ role, username, token }) => set({ role, username, token }),
  logout: () => set({ role: null, username: null, token: null }),
}));