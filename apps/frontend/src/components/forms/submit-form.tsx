import React from "react";
import { Card } from "../ui/card";
import useStore from "@/lib/store";
import PageWrapper from "../layout/page-wrapper";

const SubmitForm = () => {
  const { date, startTime, endTime } = useStore();
  return (
    <PageWrapper className="flex-1">
      <p className="text-sm text-gray-500">Noch einmal kurz alles abchecken</p>
      <Card className="flex flex-row flex-between p-6 mt-4 justify-between">
        <p className="font-bold text-xl">Datum</p>
        <p className="text-xl">{date?.toLocaleDateString()}</p>
      </Card>
      <Card className="flex flex-row flex-between p-6 mt-4 justify-between">
        <p className="font-bold text-xl">Von</p>
        <p className="text-xl">{startTime} Uhr</p>
      </Card>
      <Card className="flex flex-row flex-between p-6 mt-4 justify-between">
        <p className="font-bold text-xl">Bis</p>
        <p className="text-xl">{endTime} Uhr</p>
      </Card>
    </PageWrapper>
  );
};

export default SubmitForm;
