// src/components/slots/slot-card.tsx
"use client";

import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { BadgeCheck, Trash2 } from "lucide-react";
import { formatTime } from "@/lib/helper/format-time";
import type { Slot } from "database";
import { Button } from "../ui/button";

type SlotCardProps = {
  slot: Slot;
  onDeleted?: (id: string) => void;
};

const SlotCard: React.FC<SlotCardProps> = ({ slot, onDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
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
    } catch (error) {
      console.error("Error deleting slot", error);
      alert("Unerwarteter Fehler beim Löschen.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="flex gap-2 items-center">
        <div className="flex flex-col bg-green-200 aspect-square p-4 rounded-md">
          <BadgeCheck color="green" />
        </div>
        <div className="p-1 flex-1">
          <h3>Max Mustermann</h3>
          <span className="text-gray-500">
            {slot.start_time.getDate()}.{slot.start_time.getMonth() + 1}. um{" "}
            {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label="Termin löschen"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default SlotCard;
