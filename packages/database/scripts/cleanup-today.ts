import { prisma } from "../client";

const TZ = "Europe/Berlin";

async function main() {
  const dryRun = process.env.DRY_RUN === "true";
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is missing");

  await prisma.$connect();

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Cutoff = heute 02:00 Berlin als timestamptz
      const [row] = await tx.$queryRaw<Array<{ cutoff: Date }>>`
        SELECT ((date_trunc('day', now() AT TIME ZONE ${TZ}) + interval '2 hour') AT TIME ZONE ${TZ}) AS cutoff;
      `;
      const cutoff = row?.cutoff;

      console.log(
        "[cleanup] cutoff (02:00 Berlin today):",
        cutoff?.toISOString(),
      );
      console.log("[cleanup] DRY_RUN:", dryRun);

      // Counts: Slots vor cutoff
      const [slotCountRow] = await tx.$queryRaw<Array<{ count: number }>>`
        SELECT COUNT(*)::int AS count
        FROM "Slot"
        WHERE start_time < ${cutoff};
      `;

      // Counts: Bookings deren Slot vor cutoff liegt
      const [bookingCountRow] = await tx.$queryRaw<Array<{ count: number }>>`
        SELECT COUNT(*)::int AS count
        FROM "Booking" b
        JOIN "Slot" s ON s.id = b."slotId"
        WHERE s.start_time < ${cutoff};
      `;

      console.log("[cleanup] slots to delete:", slotCountRow?.count ?? 0);
      console.log("[cleanup] bookings to delete:", bookingCountRow?.count ?? 0);

      if (dryRun) return { deletedBookings: 0, deletedSlots: 0 };

      // 1) Bookings löschen, deren Slot < cutoff
      const deletedBookings = await tx.$executeRaw`
        DELETE FROM "Booking" b
        USING "Slot" s
        WHERE s.id = b."slotId"
          AND s.start_time < ${cutoff};
      `;

      // 2) Slots löschen
      const deletedSlots = await tx.$executeRaw`
        DELETE FROM "Slot"
        WHERE start_time < ${cutoff};
      `;

      return { deletedBookings, deletedSlots };
    });

    console.log("[cleanup] deleted bookings:", result.deletedBookings);
    console.log("[cleanup] deleted slots:", result.deletedSlots);
    console.log("[cleanup] done");
  } catch (e) {
    console.error("[cleanup] failed:", e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
