import { Slot } from "database";

export type CreateSlotDTO = Omit<Slot, "created_at" | "id">;
