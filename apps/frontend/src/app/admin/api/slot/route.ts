import { ApiHandler } from "@/lib/auth/types";
import { withAuth } from "@/lib/auth/withAuth";
import { CreateSlotDTO } from "@/lib/dtos/create-slot.dto";
import { GetSlotsQueryDTO } from "@/lib/dtos/slots-query.dto";
import { GroupType } from "@/lib/entities/user-group";
import { getLogger } from "@/lib/logger";
import { prisma } from "database";
import { NextResponse } from "next/server";

const logger = getLogger("/admin/api/slot");

const getHandler: ApiHandler<object> = async (req) => {
  const { searchParams } = new URL(req.url);

  const query: GetSlotsQueryDTO = {
    start_date: searchParams.get("start_date") ?? undefined,
    end_date: searchParams.get("end_date") ?? undefined,
  };

  const where =
    query.start_date && query.end_date
      ? {
          start_time: {
            gte: new Date(query.start_date),
          },
          end_time: {
            lte: new Date(query.end_date),
          },
        }
      : undefined;

  const slots = await prisma.slot.findMany({ where });
  return NextResponse.json({ slots }, { status: 200 });
};

const postHandler: ApiHandler<object> = async (req) => {
  try {
    const body = (await req.json()) as CreateSlotDTO;

    const slot = await prisma.slot.create({
      data: {
        end_time: body.end_time,
        start_time: body.start_time,
      },
    });

    return NextResponse.json({ slot }, { status: 201 });
  } catch (e) {
    logger.error(`Error creating slot: ${e}`);
    return NextResponse.json({ error: "Error creating slot" }, { status: 500 });
  }
};

export const POST = withAuth({
  handler: postHandler,
  allowedGroups: [GroupType.Admin, GroupType.SuperAdmin],
});

export const GET = withAuth({
  handler: getHandler,
  publicEndpoint: true,
});
