"use client";

import type { Slot } from "database";
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
