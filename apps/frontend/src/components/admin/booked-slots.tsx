import { TabsContent } from "../ui/tabs";
import SlotCard from "../slots/slot-card";
import { Session } from "next-auth";
import type { SlotWithBooking } from "@/lib/slot-service";

const BookedSlots = ({
  slots,
}: {
  slots: SlotWithBooking[];
  session: Session | undefined;
  onDeleted?: (id: string) => void;
}) => {
  return (
    <TabsContent value="buchungen">
      {slots.length === 0 ? (
        <p className="p-4 text-center text-sm text-gray-500">
          Noch hat keiner gebucht.
        </p>
      ) : (
        slots.map((slot) => (
          <SlotCard
            key={slot.id}
            slot={slot}
            title={slot.booking?.name ?? "Unbekannt"}
          />
        ))
      )}
    </TabsContent>
  );
};

export default BookedSlots;
