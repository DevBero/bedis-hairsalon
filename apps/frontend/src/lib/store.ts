import { create } from "zustand";

export enum CreateSlotsFormSteps {
  SelectDate = 0,
  SelectTimes = 1,
  Submit = 2,
}

type StoreState = {
  name: string;
  setName: (name: string) => void;
  date: Date | undefined;
  setDate: (date: Date) => void;
  currentTab: number;
  setCurrentTab: (tab: number) => void;
  startTime: string | undefined;
  setStartTime: (startTime: string) => void;
  endTime: string | undefined;
  setEndTime: (endTime: string) => void;
};

const toHHMM = (d: Date) => d.toTimeString().slice(0, 5);

const getDefaultTimes = () => {
  const now = new Date();

  return {
    startTime: toHHMM(now),
    endTime: "",
  };
};

const { startTime, endTime } = getDefaultTimes();

const useStore = create<StoreState>()((set) => ({
  name: "",
  setName: (name) => set({ name }),

  date: new Date(),
  setDate: (date) => set({ date }),

  currentTab: 0,
  setCurrentTab: (tab) => set({ currentTab: tab }),

  startTime,
  setStartTime: (time) => set({ startTime: time }),

  endTime,
  setEndTime: (time) => set({ endTime: time }),
}));

export default useStore;
