"use client";

import type { Slot } from "database";
import AdminTabs from "../admin/tabs";
import FreeSlots from "../admin/free-slots";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

const SlotsList = ({
  slots,
  session,
}: {
  slots: Slot[];
  session: Session | undefined;
}) => {
  const router = useRouter();

  const handleDeleted = () => {
    router.refresh();
  };

  return (
    <AdminTabs>
      <FreeSlots session={session} slots={slots} onDeleted={handleDeleted} />
    </AdminTabs>
  );
};

export default SlotsList;
