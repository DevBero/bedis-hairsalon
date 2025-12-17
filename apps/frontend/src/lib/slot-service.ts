import { prisma } from "database";
import { GetSlotsQueryDTO } from "./dtos/slots-query.dto";

export class SlotService {
  static instance = new SlotService();

  async list(query: GetSlotsQueryDTO) {
    const start = query.start_date ? new Date(query.start_date) : undefined;
    const end = query.end_date ? new Date(query.end_date) : undefined;

    const where =
      start && end
        ? {
            start_time: {
              ...(start ? { gte: start } : {}),
              ...(end ? { lte: end } : {}),
            },
          }
        : undefined;

    return await prisma.slot.findMany({
      where,
      orderBy: {
        start_time: "asc",
      },
    });
  }
}
