import { create } from 'zustand';

export const useFilterStore = create((set) => ({
   location: '',
   filter: '',
   specific: '',

   setLocation: (value) => set({ location: value }),
   setFilter: (value) => set({ filter: value }),
   setSpecific: (value) => set({ specific: value }),

   resetFilters: () => set({ location: '', filter: '', specific: '' }),
}));
