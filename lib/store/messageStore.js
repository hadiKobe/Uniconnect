import { create } from "zustand";

export const useMessageStore = create((set) => ({
  unreadCounts: {},
  activeChatId: null,
  setActiveChatId: (chatId) => set({ activeChatId: chatId }),

  // ✅ Set initial counts (e.g. from API)
  setUnreadCounts: (counts) =>
    set(() => ({
      unreadCounts: counts,
    })),

 incrementUnread: (chatId) =>
    set((state) => {
      if (state.activeChatId === chatId) return state;
      return {
        unreadCounts: {
          ...state.unreadCounts,
          [chatId]: (state.unreadCounts[chatId] || 0) + 1,
        },
      };
    }),

  resetUnread: (chatId) =>
      set((state) => {
        const updated = { ...state.unreadCounts };
        delete updated[chatId];
        return { unreadCounts: updated };
      }),
}));
