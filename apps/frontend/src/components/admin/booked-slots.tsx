import { TabsContent } from "../ui/tabs";
import type { Slot } from "database";
import SlotCard from "../slots/slot-card";

const BookedSlots = ({ slots }: { slots: Slot[] }) => {
  return (
    <TabsContent value="buchungen">
      {slots.length === 0 ? (
        <p className="p-4 text-center text-sm text-gray-500">
          Keine gebuchten Slots vorhanden.
        </p>
      ) : (
        slots.map((slot) => <SlotCard key={slot.id} slot={slot} />)
      )}
    </TabsContent>
  );
};

export default BookedSlots;
