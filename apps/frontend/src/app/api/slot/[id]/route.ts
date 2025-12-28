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
      include: { booking: true },
    });

    return NextResponse.json({ slot }, { status: 200 });
  } catch (e) {
    logger.error(`Error fetching slot with id ${slotId}: ${e}`);
    return NextResponse.json({ error: "Error fetching slot" }, { status: 500 });
  }
};

const deleteHandler: ApiHandler<{ id: string }> = async (
  req,
  { id: slotId }
) => {
  try {
    const url = new URL(req.url);
    const cancelBooking = url.searchParams.get("cancelBooking") === "true";

    const slot = await prisma.slot.findUnique({
      where: { id: slotId },
      include: { booking: true },
    });

    if (!slot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    // ❌ Nur Booking stornieren
    if (cancelBooking) {
      if (!slot.booking) {
        return NextResponse.json(
          { error: "This slot has no booking to cancel" },
          { status: 400 }
        );
      }

      await prisma.booking.delete({
        where: { id: slot.booking.id },
      });

      return NextResponse.json(
        { message: "Booking canceled successfully", slotId },
        { status: 200 }
      );
    }

    // 🗑 Kompletter Slot löschen (z.B. im FreeSlots-Tab)
    await prisma.slot.delete({
      where: { id: slotId },
    });

    return NextResponse.json(
      { message: "Slot deleted successfully", slotId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete slot or booking", error);
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

  const { selectedSlotId, name: bodyName } = body;
  const name = bodyName ?? session.user?.name ?? "Unbekannter Kunde";

  if (selectedSlotId && selectedSlotId !== slotId) {
    return NextResponse.json(
      { error: "Route and body slotId mismatch" },
      { status: 400 }
    );
  }

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
