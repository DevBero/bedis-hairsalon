import SlotsList from "@/components/slots/slots-list";
import { SlotService } from "@/lib/slot-service";
import { GetSlotsQueryDTO } from "@/lib/dtos/slots-query.dto";
import PageWrapper from "@/components/layout/page-wrapper";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: GetSlotsQueryDTO;
}) {
  const slots = await SlotService.instance.list(searchParams);

  return (
    <PageWrapper>
      <SlotsList slots={slots} />
    </PageWrapper>
  );
}
