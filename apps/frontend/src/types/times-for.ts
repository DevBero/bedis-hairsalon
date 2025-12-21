import { z } from "zod";

export const timesFormSchema = z.object({
  start_time: z.string(),
  end_time: z.string(),
});

export type TimesFormValues = z.infer<typeof timesFormSchema>;
