import { create } from "zustand";

const useAppStore = create((set) => ({
	count: 0,
	user: null,

	increment: () => set((state) => ({ count: state.count + 1 })),
	decrement: () => set((state) => ({ count: state.count - 1 })),
	setUser: (user) => set({ user }),
}));

export default useAppStore;
