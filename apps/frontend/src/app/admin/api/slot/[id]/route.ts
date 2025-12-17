import { ApiHandler } from "@/lib/auth/types";
import { withAuth } from "@/lib/auth/withAuth";
import { GroupType } from "@/lib/entities/user-group";
import { getLogger } from "@/lib/logger";
import { prisma } from "database";
import { NextResponse } from "next/server";

const logger = getLogger("/admin/api/slot/[id]");

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

export const GET = withAuth({
  handler: getHandler,
  allowedGroups: [GroupType.Admin, GroupType.SuperAdmin],
});
