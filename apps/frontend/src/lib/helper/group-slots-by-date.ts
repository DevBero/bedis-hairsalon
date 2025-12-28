import { format } from "date-fns";
import { SlotWithBooking } from "../slot-service";

const groupSlotsByDate = (slots: SlotWithBooking[]) => {
  const map = new Map<string, SlotWithBooking[]>();

  for (const slot of slots) {
    const date = new Date(slot.date);
    const key = format(date, "yyyy-MM-dd");
    const arr = map.get(key) ?? [];
    arr.push(slot);
    map.set(key, arr);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([key, slots]) => ({
      key,
      date: new Date(slots[0].date),
      slots,
    }));
};

export { groupSlotsByDate };
