"use client";

import FormFooter from "@/components/forms/footer";
import SubmitForm from "@/components/forms/submit-form";
import TimesForm from "@/components/forms/times-form";
import { Calendar } from "@/components/ui/calendar";
import {
  decrementTabNumer,
  incrementTabNumer,
} from "@/lib/helper/switch-tab-number";
import useStore, { CreateSlotsFormSteps } from "@/lib/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { de } from "react-day-picker/locale";

const CreateSlotsPage = () => {
  const { date, setDate } = useStore();
  const {
    startTime,
    endTime,
    currentTab,
    setCurrentTab,
    setStartTime,
    setEndTime,
  } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [start, setStart] = useState<string | undefined>(
    startTime ?? undefined
  );
  const [end, setEnd] = useState<string | undefined>(endTime ?? undefined);

  const handleSubmitDate = (date: Date | undefined) => {
    if (!date) return;

    setDate(date);
    setCurrentTab(CreateSlotsFormSteps.SelectTimes);

    incrementTabNumer({
      searchParams,
      currentTab,
      pathname,
      router,
    });
  };

  const handleSubmitTimes = () => {
    if (!start || !end) return;

    setStartTime(start);
    setEndTime(end);

    setCurrentTab(CreateSlotsFormSteps.Submit);

    incrementTabNumer({
      searchParams,
      currentTab,
      pathname,
      router,
    });
  };

  const handleBack = () => {
    if (currentTab === 0) {
      router.push("/admin");
      return;
    }
    setCurrentTab(currentTab - 1);
    decrementTabNumer({
      searchParams,
      currentTab,
      pathname,
      router,
    });
  };

  const renderCurrentStep = () => {
    switch (currentTab) {
      case CreateSlotsFormSteps.SelectDate:
        return (
          <>
            <div className="bg-gray-100">
              <Calendar locale={de} mode="single" selected={date} />
            </div>
            <FormFooter
              onBack={() => handleBack()}
              onClick={() => handleSubmitDate(date)}
            />
          </>
        );
      case CreateSlotsFormSteps.SelectTimes:
        return (
          <>
            <TimesForm
              start_time={start!}
              end_time={end!}
              setStart={setStart}
              setEnd={setEnd}
            />
            <FormFooter
              disabled={!start || !end}
              onBack={() => handleBack()}
              onClick={() => handleSubmitTimes()}
            />
          </>
        );
      case CreateSlotsFormSteps.Submit:
        return (
          <>
            <SubmitForm />
            <FormFooter
              submit
              onBack={() => handleBack()}
              onClick={() => handleSubmitDate(date)}
            />
          </>
        );
      default:
        return null;
    }
  };

  return <div className="flex-1 flex flex-col">{renderCurrentStep()}</div>;
};

export default CreateSlotsPage;
