"use client";

import type { Slot } from "database";
import AdminTabs from "../admin/tabs";
import FreeSlots from "../admin/free-slots";
import { Session } from "next-auth";

const SlotsList = ({
  slots,
  session,
}: {
  slots: Slot[];
  session: Session | Promise<Session | null>;
}) => {
  return (
    <AdminTabs>
      <FreeSlots session={session} slots={slots} />
    </AdminTabs>
  );
};

export default SlotsList;
