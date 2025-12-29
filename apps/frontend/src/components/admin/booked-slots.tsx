"use client";

import { TabsContent } from "../ui/tabs";
import SlotCard from "../slots/slot-card";
import { Session } from "next-auth";
import type { SlotWithBooking } from "@/lib/slot-service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const BookedSlots = ({
  slots,
  session,
}: {
  slots: SlotWithBooking[];
  session: Session | undefined;
}) => {
  const router = useRouter();

  const handleCancelBooking = async (slotId: string) => {
    const confirmed = window.confirm("Buchung wirklich stornieren?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/slot/${slotId}?cancelBooking=true`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg = data?.error ?? "Fehler beim Stornieren der Buchung.";
        toast.error(msg);
        return;
      }

      toast.success("Buchung wurde storniert");
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error("Ups, da ist etwas schief gelaufen.");
    }
  };

  return (
    <TabsContent value="buchungen" className="mb-20">
      {slots.length === 0 ? (
        <p className="p-4 text-center text-sm text-gray-500">
          Noch hat keiner gebucht.
        </p>
      ) : (
        slots.map((slot) => (
          <SlotCard
            key={slot.id}
            slot={slot}
            session={session}
            title={slot.booking?.name ?? "Unbekannt"}
            onDeleteClick={() => handleCancelBooking(slot.id)} // 👈 nur Booking löschen
          />
        ))
      )}
    </TabsContent>
  );
};

export default BookedSlots;
