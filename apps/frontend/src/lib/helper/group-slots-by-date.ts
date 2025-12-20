import { format } from "date-fns";
import { Slot } from "database";

const groupSlotsByDate = (slots: Slot[]) => {
  const map = new Map<string, Slot[]>();

  for (const slot of slots) {
    const date = new Date(slot.start_time);
    const key = format(date, "yyyy-MM-dd");
    const arr = map.get(key) ?? [];
    arr.push(slot);
    map.set(key, arr);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([key, slots]) => ({
      key,
      date: new Date(slots[0].start_time),
      slots,
    }));
};

export { groupSlotsByDate };
