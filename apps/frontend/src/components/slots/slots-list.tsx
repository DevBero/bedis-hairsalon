"use client";

import type { Slot } from "database";
import AdminTabs from "../admin/tabs";
import FreeSlots from "../admin/free-slots";

const SlotsList = ({ slots }: { slots: Slot[] }) => {
  return (
    <AdminTabs>
      <FreeSlots slots={slots} />
    </AdminTabs>
  );
};

export default SlotsList;
