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
    <PageWrapper className="h-full">
      <form className="mt-4 h-full justify-end flex items-end">
        <FieldGroup className="flex flex-row mb-8">
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
                  Von
                </FieldLabel>
                <Input
                  {...field}
                  type="time"
                  id="start-time-picker"
                  aria-invalid={fieldState.invalid}
                  required
                  className="h-20 text-xl [&>svg]:hidden"
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
                  Bis
                </FieldLabel>
                <Input
                  {...field}
                  type="time"
                  id="end-time-picker"
                  aria-invalid={fieldState.invalid}
                  required
                  className="h-20 text-xl"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        {/* <ActionButton
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
      </ActionButton> */}
      </form>
    </PageWrapper>
  );
};

export default TimesForm;
