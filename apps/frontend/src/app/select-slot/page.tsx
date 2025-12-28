export const dynamic = "force-dynamic";

import UserPageHeader from "@/components/layout/user-header";
import { SlotService } from "@/lib/slot-service";
import { groupSlotsByDate } from "@/lib/helper/group-slots-by-date";
import { GetSlotsQueryDTO } from "@/lib/dtos/slots-query.dto";
import { getServerSession } from "next-auth";
import ClientSlotList from "@/components/slots/client-slots-list";

type SelectSlotPageProps = {
  searchParams: Promise<GetSlotsQueryDTO>;
};

const SelectSlotPage = async ({ searchParams }: SelectSlotPageProps) => {
  const now = new Date();
  const params = await searchParams;
  const in14Days = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const session = await getServerSession();

  const slots = await SlotService.instance.list({
    start_date: params.start_date,
    end_date: in14Days,
  });

  const freeSlots = slots.filter((slot) => slot.booking === null);

  const grouped = groupSlotsByDate(freeSlots);

  return (
    <div className="flex flex-col w-full">
      <UserPageHeader title="Termin wählen" />

      <ClientSlotList grouped={grouped} session={session ?? undefined} />
    </div>
  );
};

export default SelectSlotPage;
