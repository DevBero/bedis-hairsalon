import { TabsContent } from "../ui/tabs";
import { Card, CardContent } from "../ui/card";
import { BadgeCheck } from "lucide-react";
import { formatTime } from "@/lib/helper/format-time";
import type { Slot } from "database";

const BookedSlots = ({ slots }: { slots: Slot[] }) => {
  return (
    <TabsContent value="buchungen">
      {slots.length === 0 ? (
        <p className="p-4 text-center text-sm text-gray-500">
          Keine gebuchten Slots vorhanden.
        </p>
      ) : (
        slots.map((slot) => (
          <Card key={slot.id} className="mb-4">
            <CardContent className="flex gap-2">
              <div className="flex flex-col bg-green-200 aspect square p-4 rounded-md">
                <BadgeCheck color="green" />
              </div>
              <div className="p-1">
                <h3>Max Mustermann</h3>
                <span className="text-gray-500">
                  {formatTime(slot.start_time)} -{formatTime(slot.end_time)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </TabsContent>
  );
};

export default BookedSlots;
