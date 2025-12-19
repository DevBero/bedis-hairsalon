import { z } from "zod";

export const createSlotsFromSchema = z
  .object({
    start_time: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, { message: "Ungültige Uhrzeit" }),
    end_time: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, { message: "Ungültige Uhrzeit" }),
  })
  .refine((data) => data.start_time < data.end_time, {
    message: "Endzeit muss nach Startzeit liegen",
    path: ["end_time"],
  });

export type CreateSlotsFormValues = z.infer<typeof createSlotsFromSchema>;
