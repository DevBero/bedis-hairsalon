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
import useStore from "@/lib/store";
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
  const [start, setStart] = useState<string | undefined>(
    startTime ?? undefined
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [end, setEnd] = useState<string | undefined>(endTime ?? undefined);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const slotCount = getSlotCount(startTime ?? undefined, endTime ?? undefined);
  const searchParams = useSearchParams();
  const t = searchParams.get("t") ?? "0";
  const step = Number(t);

  const handleSubmitDate = () => {
    if (!selectedDate) return;

    setDate(selectedDate);

    incrementTabNumer({
      searchParams,
      pathname,
      router,
    });
  };

  const handleSubmitTimes = () => {
    if (!start || !end) {
      console.log("Start oder end fehlt");
      return;
    }

    setStartTime(start);
    setEndTime(end);

    incrementTabNumer({
      searchParams,
      pathname,
      router,
    });
  };

  const handleBack = () => {
    if (step === 0) {
      router.push("/admin");
      return;
    }
    setCurrentTab(currentTab - 1);
    decrementTabNumer({
      searchParams,
      pathname,
      router,
    });
  };

  const formatDateLocal = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleCreateSlots = async () => {
    if (!date || !startTime || !endTime) return;

    try {
      setIsSubmitting(true);
      const payload: CreateSlotsDTO = {
        date: formatDateLocal(date),
        start_time: startTime,
        end_time: endTime,
      };

      const res = await fetch("/api/slot", {
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
    if (pathname !== "/admin/create-slots") return null;

    if (step === 0) {
      return (
        <>
          <Calendar
            locale={de}
            mode="single"
            selected={selectedDate}
            onSelect={(date) => setSelectedDate(date)}
          />
          <FormFooter onBack={handleBack} onClick={handleSubmitDate} />
        </>
      );
    }

    if (step === 1) {
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
            onBack={handleBack}
            onClick={handleSubmitTimes}
          />
        </>
      );
    }

    if (step === 2) {
      return (
        <>
          <SubmitForm />
          <FormFooter
            loading={isSubmitting}
            submit
            onBack={handleBack}
            onClick={handleCreateSlots}
          />
        </>
      );
    }

    return null;
  };

  return <div className="flex-1 flex flex-col">{renderCurrentStep()}</div>;
};

export default CreateSlotsPage;
