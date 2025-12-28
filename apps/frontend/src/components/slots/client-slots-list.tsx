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

  const handleSelectSlot = (id: string) => {
    setSelectedSlot(id);
  };

  const handleSubmitBooking = async () => {
    if (!selectedSlot) return;
    if (!session) {
      toast.error("Bitte melde dich an, um einen Termin zu buchen.");
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
          name: session.user?.name, // optional
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg = data?.error ?? "Fehler bei der Buchung.";
        toast.error(msg);
        return;
      }

      toast.success("Termin erfolgreich gebucht!", {
        description: "Du erhältst in Kürze eine Bestätigung.",
        closeButton: true,
        richColors: true,
      });

      router.refresh();
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
      <Accordion type="single" collapsible className="w-full">
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
            className="w-full bg-green-700"
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
