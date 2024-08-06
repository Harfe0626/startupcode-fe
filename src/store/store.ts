import { create } from "zustand";

// 스토어 상태 타입 정의
interface StoreState {
  thread_id: string;
  chat_list: string[];
  setThreadId: (id: string) => void;
  addToChatList: (message: string) => void;
  clearChatList: () => void;
}

// zustand hook
const useStore = create<StoreState>((set) => ({
  thread_id: "",
  chat_list: [],
  setThreadId: (id: string) => set({ thread_id: id }),
  addToChatList: (message: string) =>
    set((state) => ({ chat_list: [...state.chat_list, message] })),
  clearChatList: () => set({ chat_list: [] }),
}));

export default useStore;
