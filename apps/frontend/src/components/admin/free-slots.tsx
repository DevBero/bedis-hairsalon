import { TabsContent } from "../ui/tabs";
import type { Slot } from "database";
import SlotCard from "../slots/slot-card";
import { Session } from "next-auth";

const FreeSlots = ({
  slots,
  session,
  onDeleted,
}: {
  slots: Slot[];
  session: Session | undefined;
  onDeleted?: (id: string) => void;
}) => {
  return (
    <TabsContent value="termine">
      {slots.length === 0 ? (
        <p className="p-4 text-center text-sm text-gray-500">
          Keine gebuchten Slots vorhanden.
        </p>
      ) : (
        slots.map((slot) => (
          <SlotCard
            key={slot.id}
            session={session}
            onDeleted={onDeleted}
            slot={{
              ...slot,
              title: "Freier Termin",
            }}
          />
        ))
      )}
    </TabsContent>
  );
};

export default FreeSlots;
