"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import SlotCard from "@/components/slots/slot-card";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import type { Session } from "next-auth";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SlotWithBooking } from "@/lib/slot-service";
import useStore from "@/lib/store";

type GroupedSlots = {
  key: string;
  date: Date;
  slots: SlotWithBooking[];
};

type ClientSlotsListProps = {
  grouped: GroupedSlots[];
  session: Session | undefined;
};

const ClientSlotsList: React.FC<ClientSlotsListProps> = ({
  grouped,
  session,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<string | undefined>(
    undefined
  );
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
  const router = useRouter();
  const { name } = useStore();

  const handleSelectSlot = (id: string) => {
    setSelectedSlot(id);
  };

  const handleSubmitBooking = async () => {
    if (!selectedSlot) return;
    if (!session) {
      toast.error("Bitte melde dich an, um einen Termin zu buchen.");
      return;
    }

    if (!name) {
      toast.error("Name ist erforderlich");
      return;
    }

    const flatSlots = grouped.flatMap((g) => g.slots);
    const slot = flatSlots.find((s) => s.id === selectedSlot);
    if (!slot) {
      toast.error("Ausgewählter Termin wurde nicht gefunden.");
      return;
    }

    try {
      setIsLoadingSubmit(true);

      const res = await fetch(`/api/slot/${selectedSlot}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slotId: selectedSlot,
          name,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg = data?.error ?? "Fehler bei der Buchung.";
        toast.error(msg);
        return;
      }

      const bookingDate = slot.date.toISOString().split("T")[0];
      const start = format(slot.start_time, "HH:mm");
      const end = format(slot.end_time, "HH:mm");

      const params = new URLSearchParams({
        date: bookingDate,
        start,
        end,
        title: name || "Termin",
      });

      router.push(`/select-slot/submit?${params.toString()}`);

      toast.success("Termin erfolgreich gebucht!", {
        description: "Du erhältst in Kürze eine Bestätigung.",
        closeButton: true,
        richColors: true,
      });
    } catch (e) {
      console.error(e);
      toast.error("Ups, da ist etwas schief gelaufen.");
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  return grouped.length === 0 ? (
    <p className="p-4 text-center text-sm text-gray-500">
      In den nächsten 14 Tagen sind keine Termine verfügbar.
    </p>
  ) : (
    <>
      <Accordion type="single" collapsible className="w-full mb-20">
        {grouped.map(({ key, date, slots }) => (
          <AccordionItem key={key} value={key}>
            <AccordionTrigger className="p-4">
              {format(date, "EEEE, dd. MMMM", { locale: de })}
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col">
                {slots.map((slot) => (
                  <SlotCard
                    key={slot.id}
                    session={session}
                    slot={slot}
                    title="Freier Termin"
                    onSelect={() => handleSelectSlot(slot.id)}
                    isSelected={selectedSlot === slot.id}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {selectedSlot && (
        <div className="m-4 fixed bottom-0 mb-8 w-[calc(100%-2rem)]">
          <Button
            onClick={() => handleSubmitBooking()}
            className="w-full bg-blue-600"
            size="lg"
          >
            {isLoadingSubmit ? "...loading" : "Termin buchen"}
          </Button>
        </div>
      )}
    </>
  );
};

export default ClientSlotsList;
