"use client";

import FormFooter from "@/components/forms/footer";
import SubmitForm from "@/components/forms/submit-form";
import TimesForm from "@/components/forms/times-form";
import { Calendar } from "@/components/ui/calendar";
import { CreateSlotsDTO } from "@/lib/dtos/create-slot.dto";
import getSlotCount from "@/lib/helper/get-slots-count";
import {
  decrementTabNumer,
  incrementTabNumer,
} from "@/lib/helper/switch-tab-number";
import useStore, { CreateSlotsFormSteps } from "@/lib/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { de } from "react-day-picker/locale";
import { toast } from "sonner";

const CreateSlotsPage = () => {
  const {
    date,
    startTime,
    endTime,
    currentTab,
    setCurrentTab,
    setStartTime,
    setEndTime,
    setDate,
  } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [start, setStart] = useState<string | undefined>(
    startTime ?? undefined
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [end, setEnd] = useState<string | undefined>(endTime ?? undefined);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const slotCount = getSlotCount(startTime ?? undefined, endTime ?? undefined);

  const handleSubmitDate = () => {
    if (!selectedDate) return;

    setDate(selectedDate);
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

  const handleCreateSlots = async () => {
    if (!date || !startTime || !endTime) return;

    try {
      setIsSubmitting(true);
      const payload: CreateSlotsDTO = {
        date: date.toISOString().split("T")[0],
        start_time: startTime,
        end_time: endTime,
      };

      const res = await fetch("/api/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("Failed to create slots");
        return;
      }

      router.push("/admin");

      toast.success(`${slotCount} Termine erfolgreich angelegt`, {
        description: "Du kannst freie Termine in deinem Dashboard sehen",
        closeButton: true,
        richColors: true,
      });
    } catch (err) {
      console.error("Error creating slots", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentTab) {
      case CreateSlotsFormSteps.SelectDate:
        return (
          <>
            <div className="bg-gray-100">
              <Calendar
                locale={de}
                mode="single"
                selected={selectedDate}
                onSelect={(date) => setSelectedDate(date)}
              />
            </div>
            <FormFooter
              onBack={() => handleBack()}
              onClick={() => handleSubmitDate()}
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
              loading={isSubmitting}
              submit
              onBack={() => handleBack()}
              onClick={() => handleCreateSlots()}
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
