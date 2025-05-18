import { create } from 'zustand';

export const useFilterStore = create((set) => ({
   filters: {},

   setFilters: (pathname, newFilters) =>
      set((state) => ({
         filters: {
            ...state.filters,
            [pathname]: {
               ...(state.filters[pathname] || {}),
               ...newFilters,
            },
         },
      })),

   resetFilters: (pathname) =>
      set((state) => {
         const updated = { ...state.filters };
         delete updated[pathname];
         return { filters: updated };
      }),
}));
