// app/(whatever)/select-slot/page.tsx

import PageWrapper from "@/components/layout/page-wrapper";
import UserPageHeader from "@/components/layout/user-header";
import SlotCard from "@/components/slots/slot-card";
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

const SelectSlotPage = async () => {
  const now = new Date();
  const in14Days = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  const slots = await SlotService.instance.list({
    start_date: now.toISOString(),
    end_date: in14Days.toISOString(),
  });

  const grouped = groupSlotsByDate(slots);

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
                      <SlotCard key={slot.id} slot={slot} />
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
