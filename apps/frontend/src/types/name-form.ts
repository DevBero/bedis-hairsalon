import { z } from "zod";

export const nameFormSchema = z.object({
  name: z.string().trim().min(1),
});

export type NameFormValues = z.infer<typeof nameFormSchema>;
