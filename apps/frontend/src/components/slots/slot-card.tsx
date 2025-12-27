"use client";

import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { BadgeCheck, Calendar, Trash2 } from "lucide-react";
import { formatTime } from "@/lib/helper/format-time";
import type { Slot } from "database";
import { Button } from "../ui/button";
import { SlotCardType } from "@/types/slot-card-type";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import { toast } from "sonner";

type SlotCardProps = {
  slot: Slot & {
    title: string;
    type?: SlotCardType;
  };
  onDeleted?: (id: string) => void;
  session: Session | Promise<Session | null> | undefined;
};

const SlotCard: React.FC<SlotCardProps> = ({ slot, onDeleted, session }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const isBooking = slot.type === SlotCardType.Booking;

  const handleDelete = async () => {
    if (!session) return;

    const confirmed = window.confirm(
      "Willst du diesen Termin wirklich löschen?"
    );
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/slots/${slot.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Failed to delete slot", await res.json());
        alert("Fehler beim Löschen des Termins.");
        return;
      }

      onDeleted?.(slot.id);
      toast.success(`Termin erfolgreich gelöscht`, {
        description: "Du hast dein Termin erfolgreich gelöscht.",
        closeButton: true,
        richColors: true,
      });
    } catch (error) {
      console.error("Error deleting slot", error);
      toast.error(`Ups. Es gab wohl ein Fehler`, {
        description:
          "Es gab wohl ein Fehler beim löschen eines Termins. Bitte melde dich bei deinem Boss Bruder",
        closeButton: true,
        richColors: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="flex gap-2 items-center">
        <div
          className={cn(
            `flex flex-col aspect-square p-4 rounded-md`,
            isBooking ? "bg-green-200" : "bg-gray-200"
          )}
        >
          {isBooking ? <BadgeCheck color="green" /> : <Calendar />}
        </div>
        <div className="p-1 flex-1">
          <h3>{slot.title}</h3>
          <span className="text-gray-500">
            {slot.date.toLocaleDateString("de")} um{" "}
            {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
          </span>
        </div>
        {session && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label="Termin löschen"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SlotCard;
