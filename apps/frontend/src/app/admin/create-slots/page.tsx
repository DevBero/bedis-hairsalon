"use client";

import FormFooter from "@/components/forms/footer";
import SubmitForm from "@/components/forms/submit-form";
import TimesForm from "@/components/forms/times-form";
import PageWrapper from "@/components/layout/page-wrapper";
import { Calendar } from "@/components/ui/calendar";
import {
  decrementTabNumer,
  incrementTabNumer,
} from "@/lib/helper/switch-tab-number";
import useStore, { CreateSlotsFormSteps } from "@/lib/store";
import { TimesFormValues } from "@/types/times-for";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { de } from "react-day-picker/locale";

const CreateSlotsPage = () => {
  const { date, setDate } = useStore();
  const {
    currentTab,
    setCurrentTab,
    setStartTime,
    startTime,
    endTime,
    setEndTime,
  } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  const handleSubmitTimes = ({ start_time, end_time }: TimesFormValues) => {
    if (!start_time || !end_time) {
      return;
    }
    setStartTime(start_time);
    setEndTime(end_time);

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
          <PageWrapper className="flex-1 flex flex-col">
            <TimesForm />
            <FormFooter
              onBack={() => handleBack()}
              onClick={() =>
                handleSubmitTimes({
                  start_time: startTime!,
                  end_time: endTime!,
                })
              }
            />
          </PageWrapper>
        );
      case CreateSlotsFormSteps.Submit:
        return (
          <>
            <PageWrapper className="h-full flex flex-col">
              <SubmitForm />
              <FormFooter
                submit
                onBack={() => handleBack()}
                onClick={() => handleSubmitDate(date)}
              />
            </PageWrapper>
          </>
        );
      default:
        return null;
    }
  };

  return <div className="flex-1 flex flex-col">{renderCurrentStep()}</div>;
};

export default CreateSlotsPage;
