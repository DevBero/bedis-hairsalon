import { prisma } from "database";
import { GetSlotsQueryDTO } from "./dtos/slots-query.dto";

export class SlotService {
  static instance = new SlotService();

  async list(query: GetSlotsQueryDTO) {
    const start = query.start_date;
    const end = query.end_date;

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

  async delete(id: string) {
    return prisma.slot.delete({
      where: { id },
    });
  }
}
