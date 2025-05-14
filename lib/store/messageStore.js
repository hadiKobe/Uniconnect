import { create } from "zustand";

export const useMessageStore = create((set) => ({
  unreadCounts: {},
  incrementUnread: (chatId) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [chatId]: (state.unreadCounts[chatId] || 0) + 1,
      },
    })),
  resetUnread: (chatId) =>
    set((state) => {
      const updated = { ...state.unreadCounts };
      delete updated[chatId];
      return { unreadCounts: updated };
    }),
}));
