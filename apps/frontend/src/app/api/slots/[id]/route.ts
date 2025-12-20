import { ApiHandler } from "@/lib/auth/types";
import { withAuth } from "@/lib/auth/withAuth";
import { getLogger } from "@/lib/helper/logger";
import { prisma } from "database";
import { NextResponse } from "next/server";

const logger = getLogger("/api/slot/[id]");

const getHandler: ApiHandler<{ id: string }> = async (_, { id: slotId }) => {
  try {
    const slot = await prisma.slot.findUniqueOrThrow({
      where: { id: slotId },
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

export const GET = withAuth(getHandler);
export const DELETE = withAuth(deleteHandler);
