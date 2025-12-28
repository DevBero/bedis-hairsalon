"use client";

import AdminTabs from "../admin/tabs";
import FreeSlots from "../admin/free-slots";
import BookedSlots from "../admin/booked-slots";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import type { SlotWithBooking } from "@/lib/slot-service";

const SlotsList = ({
  slots,
  session,
}: {
  slots: SlotWithBooking[];
  session: Session | undefined;
}) => {
  const router = useRouter();

  const handleDeleted = () => {
    router.refresh();
  };

  const bookedSlots = slots.filter((slot) => slot.booking !== null);
  const freeSlots = slots.filter((slot) => slot.booking === null);

  return (
    <AdminTabs>
      <BookedSlots session={session} slots={bookedSlots} />
      <FreeSlots
        session={session}
        slots={freeSlots}
        onDeleted={handleDeleted}
      />
    </AdminTabs>
  );
};

export default SlotsList;
