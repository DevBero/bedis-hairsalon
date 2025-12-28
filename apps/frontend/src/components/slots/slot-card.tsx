"use client";

import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { BadgeCheck, Calendar, Trash2 } from "lucide-react";
import { formatTime } from "@/lib/helper/format-time";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import { toast } from "sonner";
import { SlotWithBooking } from "@/lib/slot-service";

type SlotCardProps = {
  title: string;
  slot: SlotWithBooking;
  onDeleted?: (id: string) => void;
  session?: Session;
  onSelect?: () => void; // 👈 neu
  isSelected?: boolean; // 👈 neu
};

const SlotCard: React.FC<SlotCardProps> = ({
  title,
  slot,
  onDeleted,
  session,
  onSelect,
  isSelected,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const hasBooking = slot.booking !== undefined;

  const handleDelete = async () => {
    if (!session) return;
    const confirmed = window.confirm(
      "Willst du diesen Termin wirklich löschen?"
    );
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/slot/${slot.id}`, {
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
    <Card
      className={cn(
        "mb-4 cursor-pointer transition-colors my-2 mx-4",
        isSelected && "outline-solid outline-green-700"
      )}
      onClick={onSelect}
    >
      <CardContent className="flex gap-2 items-center">
        <div
          className={cn(
            `flex flex-col aspect-square p-4 rounded-md`,
            hasBooking ? "bg-green-200" : "bg-gray-200"
          )}
        >
          {hasBooking ? <BadgeCheck color="green" /> : <Calendar />}
        </div>
        <div className="p-1 flex-1">
          <h3>{title}</h3>
          <span className="text-gray-500">
            {slot.date.toLocaleDateString("de")} um{" "}
            {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
          </span>
        </div>
        {session && onDeleted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation(); // Klick auf Delete nicht als "select" werten
              handleDelete();
            }}
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
