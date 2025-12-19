"use client";

import type { Slot } from "@prisma/client";
import AdminTabs from "../admin/tabs";
import BookedSlots from "../admin/booked-slots";

const SlotsList = ({ slots }: { slots: Slot[] }) => {
  return (
    <AdminTabs>
      <BookedSlots slots={slots} />
    </AdminTabs>
  );
};

export default SlotsList;
