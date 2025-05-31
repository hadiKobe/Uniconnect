// lib/store/userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set) => ({
      userInfo: null,
      setUserInfo: (data) => set({ userInfo: data }),
      updateField: (key, value) =>
        set((state) => ({
          userInfo: { ...state.userInfo, [key]: value },
        })),
    }),
    {
      name: 'user-info', // key in localStorage
    }
  )
);
