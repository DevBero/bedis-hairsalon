"use client";

import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { nameFormSchema } from "@/types/name-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useStore from "@/lib/store";
import { useRouter } from "next/navigation";

const NameForm = () => {
  const { setName } = useStore();
  const router = useRouter();
  const form = useForm<z.infer<typeof nameFormSchema>>({
    resolver: zodResolver(nameFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleNameSubmit = (values: z.infer<typeof nameFormSchema>) => {
    setName(values.name);
    router.push("/select-slot");
  };

  return (
    <>
      <h1 className="text-5xl font-bold mb-8">Bedis Hairsalon</h1>

      <form
        onSubmit={form.handleSubmit((values) => {
          handleNameSubmit(values);
        })}
        className="flex flex-col gap-4 w-full lg:max-w-[50%]"
      >
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel aria-required htmlFor="name">
                  Name
                </FieldLabel>
                <Input
                  {...field}
                  id="name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Gib deinen Namen ein"
                  autoComplete="off"
                  required
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        <Button size="lg" disabled={!form.formState.isValid} type="submit">
          Weiter
        </Button>
      </form>
    </>
  );
};

export default NameForm;
