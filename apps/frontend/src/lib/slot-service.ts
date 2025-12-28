import { prisma } from "database";
import { GetSlotsQueryDTO } from "./dtos/slots-query.dto";
import type { Slot, Booking } from "database";

export type SlotWithBooking = Slot & { booking: Booking | null };

export class SlotService {
  static instance = new SlotService();

  async list(query: GetSlotsQueryDTO): Promise<SlotWithBooking[]> {
    const start = query.start_date;
    const end = query.end_date;

    const where =
      start || end
        ? {
            start_time: {
              ...(start ? { gte: start } : {}),
              ...(end ? { lte: end } : {}),
            },
          }
        : undefined;

    return prisma.slot.findMany({
      where,
      orderBy: {
        start_time: "asc",
      },
      include: {
        booking: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.slot.delete({
      where: { id },
    });
  }
}
