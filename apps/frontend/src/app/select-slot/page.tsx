export const dynamic = "force-dynamic";

import PageWrapper from "@/components/layout/page-wrapper";
import UserPageHeader from "@/components/layout/user-header";
import { SlotService } from "@/lib/slot-service";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { groupSlotsByDate } from "@/lib/helper/group-slots-by-date";
import { GetSlotsQueryDTO } from "@/lib/dtos/slots-query.dto";
import SlotCard from "@/components/slots/slot-card";
import { getServerSession } from "next-auth";

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

  const grouped = groupSlotsByDate(slots);

  console.log("SESSION ", session);

  return (
    <div className="flex flex-col w-full">
      <UserPageHeader title="Termin wählen" />
      <PageWrapper>
        {grouped.length === 0 ? (
          <p className="p-4 text-center text-sm text-gray-500">
            In den nächsten 14 Tagen sind keine Termine verfügbar.
          </p>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {grouped.map(({ key, date, slots }) => (
              <AccordionItem key={key} value={key}>
                <AccordionTrigger>
                  {format(date, "EEEE, dd. MMMM", { locale: de })}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col">
                    {slots.map((slot) => (
                      <SlotCard
                        session={session ?? undefined}
                        key={slot.id}
                        slot={{
                          ...slot,
                          title: "Freier Termin",
                        }}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </PageWrapper>
    </div>
  );
};

export default SelectSlotPage;
