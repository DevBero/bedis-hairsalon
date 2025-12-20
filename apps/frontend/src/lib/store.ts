import { create } from "zustand";

type StoreState = {
  name: string;
  setName: (name: string) => void;
};

const useStore = create<StoreState>()((set) => ({
  name: "",
  setName: (name) => set({ name }),
}));

export default useStore;
