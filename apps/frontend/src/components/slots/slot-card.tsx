"use client";

import React from "react";
import { Card, CardContent } from "../ui/card";
import { BadgeCheck, Calendar, Trash2 } from "lucide-react";
import { formatTime } from "@/lib/helper/format-time";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import { SlotWithBooking } from "@/lib/slot-service";

type SlotCardProps = {
  title: string;
  slot: SlotWithBooking;
  session?: Session;
  onSelect?: () => void;
  isSelected?: boolean;
  onDeleteClick?: () => void; // 👈 neu, generischer Callback
};

const SlotCard: React.FC<SlotCardProps> = ({
  title,
  slot,
  session,
  onSelect,
  isSelected,
  onDeleteClick,
}) => {
  const hasBooking = slot.booking !== null;

  return (
    <Card
      className={cn(
        "mb-4 cursor-pointer transition-colors my-2 mx-4",
        isSelected && "outline-solid outline-blue-600"
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
        {session && onDeleteClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick();
            }}
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
