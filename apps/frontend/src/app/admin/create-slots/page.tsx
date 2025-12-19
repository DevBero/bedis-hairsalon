"use client";

import ActionButton from "@/components/admin/action-button";
import PageWrapper from "@/components/layout/page-wrapper";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getCurrentTime } from "@/lib/helper/get-current-time";
import { createSlotsFromSchema } from "@/types/create-slots-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import React from "react";
import { de } from "react-day-picker/locale";
import { Controller, useForm, useWatch } from "react-hook-form";
import z from "zod";

const CreateSlotsPage = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const currentTime = getCurrentTime();

  const form = useForm<z.infer<typeof createSlotsFromSchema>>({
    resolver: zodResolver(createSlotsFromSchema),
    mode: "onChange",
    defaultValues: {
      start_time: currentTime,
      end_time: "",
    },
  });

  const {
    control,
    formState: { isValid, isSubmitting },
  } = form;

  const startTime = useWatch({ control: form.control, name: "start_time" });
  const endTimeValue = useWatch({ control: form.control, name: "end_time" });

  const canSubmit = !!date && !!startTime && !!endTimeValue && isValid;

  const onSubmit = async (values: z.infer<typeof createSlotsFromSchema>) => {
    if (!date) return;

    const dateStr = date.toISOString().slice(0, 10); // "YYYY-MM-DD"

    const payload = {
      date: dateStr,
      start_time: values.start_time,
      end_time: values.end_time,
      intervalMinutes: 30,
    };

    try {
      const res = await fetch("/admin/api/slots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // TODO: nicer error handling
        console.error("Failed to create slots");
        return;
      }

      const data = await res.json();
      console.log("Slots created:", data);
      // TODO: Toast anzeigen, redirect, Form reset etc.
    } catch (err) {
      console.error("Error calling API:", err);
    }
  };

  return (
    <>
      <Calendar locale={de} mode="single" selected={date} onSelect={setDate} />
      <PageWrapper>
        <form>
          <FieldGroup className="flex flex-row">
            <Controller
              name="start_time"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    aria-required
                    htmlFor="start_time"
                    className="text-md"
                  >
                    Schichtbeginn
                  </FieldLabel>
                  <Input
                    {...field}
                    type="time"
                    id="start-time-picker"
                    aria-invalid={fieldState.invalid}
                    required
                    className="flex w-full h-20 text-xl"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="end_time"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    aria-required
                    htmlFor="end_time"
                    className="text-md"
                  >
                    Schichtende
                  </FieldLabel>
                  <Input
                    {...field}
                    type="time"
                    id="end-time-picker"
                    aria-invalid={fieldState.invalid}
                    required
                    className="flex w-full h-20 text-xl"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <ActionButton
            className={`
               transition-all duration-300
              ${canSubmit ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
            `}
          >
            <Button
              type="submit"
              size="lg"
              disabled={!canSubmit || isSubmitting}
              onClick={form.handleSubmit(onSubmit)}
            >
              {isSubmitting ? <LoaderCircle /> : "Termine erstellen"}
            </Button>
          </ActionButton>
        </form>
      </PageWrapper>
    </>
  );
};

export default CreateSlotsPage;
