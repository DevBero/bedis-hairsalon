import { authOptions } from "@/lib/auth/auth-options";
import { ApiHandler } from "@/lib/auth/types";
import { withAuth } from "@/lib/auth/withAuth";
import { getLogger } from "@/lib/helper/logger";
import { prisma } from "database";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const logger = getLogger("/api/slot/[id]");

const getHandler: ApiHandler<{ id: string }> = async (_, { id: slotId }) => {
  try {
    const slot = await prisma.slot.findUniqueOrThrow({
      where: { id: slotId },
      include: { booking: true }, // optional
    });

    return NextResponse.json({ slot }, { status: 200 });
  } catch (e) {
    logger.error(`Error fetching slot with id ${slotId}: ${e}`);
    return NextResponse.json({ error: "Error fetching slot" }, { status: 500 });
  }
};

const deleteHandler: ApiHandler<{ id: string }> = async (_, { id: slotId }) => {
  try {
    const slot = await prisma.slot.findUnique({
      where: { id: slotId },
    });

    if (!slot) {
      logger.warn(`Slot not found: ${slotId}`);
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    await prisma.slot.delete({
      where: { id: slotId },
    });

    return NextResponse.json(
      { message: "Slot deleted successfully", id: slotId },
      { status: 200 }
    );
  } catch (error) {
    logger.error({ slotId, error: String(error) }, "Failed to delete slot");

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

const patchHandler: ApiHandler<{ id: string }> = async (
  req,
  { id: slotId }
) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const name = body.name ?? session.user?.name ?? "Unbekannter Kunde";

  const slot = await prisma.slot.findUnique({
    where: { id: slotId },
    include: { booking: true },
  });

  if (!slot) {
    return NextResponse.json({ error: "Slot not found" }, { status: 404 });
  }

  if (slot.booking) {
    return NextResponse.json({ error: "Slot already booked" }, { status: 409 });
  }

  const booking = await prisma.booking.create({
    data: {
      slotId,
      name,
    },
  });

  return NextResponse.json({ slot: { ...slot, booking } }, { status: 200 });
};

export const GET = withAuth(getHandler);
export const DELETE = withAuth(deleteHandler);
export const PATCH = withAuth(patchHandler);
