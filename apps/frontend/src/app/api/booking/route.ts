import { getLogger } from "@/lib/helper/logger";
import { prisma } from "database";
import { NextResponse } from "next/server";
import { z } from "zod";

const bookingSchema = z.object({
  name: z.string(),
  slotId: z.string(),
});

const logger = getLogger("/api/booking");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = bookingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json("Validation failed", { status: 400 });
    }

    const { name, slotId } = validation.data;

    const slot = await prisma.slot.findUnique({
      where: {
        id: slotId,
      },
      include: {
        booking: true,
      },
    });

    if (!slot) {
      return NextResponse.json({ message: "Slot not found" }, { status: 404 });
    }

    if (slot.booking) {
      return NextResponse.json(
        { message: "Slot already booked" },
        { status: 409 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        name,
        slot: {
          connect: {
            id: slotId,
          },
        },
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch {
    logger.error("Error creating booking");
    return NextResponse.json(
      { message: "Error creating booking" },
      { status: 500 }
    );
  }
}
