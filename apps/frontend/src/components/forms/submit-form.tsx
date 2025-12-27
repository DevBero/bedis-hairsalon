import React from "react";
import { Card } from "../ui/card";
import useStore from "@/lib/store";
import PageWrapper from "../layout/page-wrapper";
import getSlotCount from "@/lib/helper/get-slots-count";

const SubmitForm = () => {
  const { date, startTime, endTime } = useStore();
  const slotCount = getSlotCount(startTime ?? undefined, endTime ?? undefined);

  return (
    <PageWrapper className="flex-1">
      <p className="text-sm text-gray-500">Noch einmal kurz alles abchecken</p>
      <Card className="flex flex-row flex-between p-6 mt-4 justify-between">
        <p className="font-medium text-xl">Datum</p>
        <p className="text-xl">{date?.toLocaleDateString("de")}</p>
      </Card>
      <Card className="flex flex-row flex-between p-6 mt-4 justify-between">
        <p className="font-medium text-xl">Von</p>
        <p className="text-xl">{startTime} Uhr</p>
      </Card>
      <Card className="flex flex-row flex-between p-6 mt-4 justify-between">
        <p className="font-medium text-xl">Bis</p>
        <p className="text-xl">{endTime} Uhr</p>
      </Card>
      <Card className="flex flex-row flex-between p-6 mt-4 justify-between">
        <p className="font-medium text-xl">Zeitslots (à 30 Min)</p>
        <p className="text-xl">
          {slotCount > 0 ? `${slotCount} Slots` : "0 Slots"}
        </p>
      </Card>
    </PageWrapper>
  );
};

export default SubmitForm;
