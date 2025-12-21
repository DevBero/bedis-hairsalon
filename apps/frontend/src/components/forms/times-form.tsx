import React from "react";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { timesFormSchema, TimesFormValues } from "@/types/times-for";
import useStore from "@/lib/store";
import PageWrapper from "../layout/page-wrapper";

const TimesForm = () => {
  const { startTime, setStartTime } = useStore();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<TimesFormValues>({
    resolver: zodResolver(timesFormSchema),
    defaultValues: {
      start_time: startTime,
      end_time: "",
    },
  });

  return (
    <form className="mt-4 h-full justify-end flex items-end p-3 mb-8">
      <Input
        type="time"
        id="start-time-picker"
        required
        className="h-20 text-xl [&>svg]:hidden"
      />
      <Input
        type="time"
        id="end-time-picker"
        required
        className="h-20 text-xl"
      />
    </form>
  );
};

export default TimesForm;
