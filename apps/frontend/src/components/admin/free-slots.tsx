"use client";

import { TabsContent } from "../ui/tabs";
import SlotCard from "../slots/slot-card";
import { Session } from "next-auth";
import type { SlotWithBooking } from "@/lib/slot-service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const FreeSlots = ({
  slots,
  session,
}: {
  slots: SlotWithBooking[];
  session: Session | undefined;
}) => {
  const router = useRouter();

  const handleDeleteSlot = async (slotId: string) => {
    const confirmed = window.confirm("Freien Termin wirklich löschen?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/slot/${slotId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg = data?.error ?? "Fehler beim Löschen des Slots.";
        toast.error(msg);
        return;
      }

      toast.success("Termin erfolgreich gelöscht");
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error("Ups, da ist etwas schief gelaufen.");
    }
  };

  return (
    <TabsContent value="termine">
      {slots.length === 0 ? (
        <p className="p-4 text-center text-sm text-gray-500">
          Keine freien Termine verfügbar.
        </p>
      ) : (
        slots.map((slot) => (
          <SlotCard
            key={slot.id}
            slot={slot}
            session={session}
            title="Freier Termin"
            onDeleteClick={() => handleDeleteSlot(slot.id)} // 👈 Slot löschen
          />
        ))
      )}
    </TabsContent>
  );
};

export default FreeSlots;
