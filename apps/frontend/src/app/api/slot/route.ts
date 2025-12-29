import { ApiHandler } from "@/lib/auth/types";
import { withAuth } from "@/lib/auth/withAuth";
import { CreateSlotsDTO } from "@/lib/dtos/create-slot.dto";
import { GetSlotsQueryDTO } from "@/lib/dtos/slots-query.dto";
import { combineDateAndTimeLocal } from "@/lib/helper/cobine-date-and-time";
import { getLogger } from "@/lib/helper/logger";
import { parseDateOnly } from "@/lib/helper/parse-date";
import { prisma } from "database";
import { NextResponse } from "next/server";
const INTERVAL_MINUTES = 30;

const logger = getLogger("/api/slot");

const getHandler: ApiHandler<object> = async (req) => {
  const { searchParams } = new URL(req.url);

  const startDateParam = searchParams.get("start_date");
  const endDateParam = searchParams.get("end_date");

  const query: GetSlotsQueryDTO = {
    start_date: startDateParam ? new Date(startDateParam) : undefined,
    end_date: endDateParam ? new Date(endDateParam) : undefined,
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
    const body = (await req.json()) as CreateSlotsDTO;

    const startDateTime = combineDateAndTimeLocal(body.date, body.start_time);
    const endDateTime = combineDateAndTimeLocal(body.date, body.end_time);

    const slotDate = parseDateOnly(body.date);

    if (endDateTime <= startDateTime) {
      return NextResponse.json(
        { error: "end_time must be after start_time" },
        { status: 400 }
      );
    }

    const slotsData: { date: Date; start_time: Date; end_time: Date }[] = [];

    let currentStart = new Date(startDateTime);

    while (currentStart < endDateTime) {
      const currentEnd = new Date(currentStart);
      currentEnd.setMinutes(currentEnd.getMinutes() + INTERVAL_MINUTES);

      if (currentEnd > endDateTime) {
        break;
      }

      slotsData.push({
        date: slotDate, // ⬅️ immer dasselbe (z.B. 2026-02-02)
        start_time: currentStart,
        end_time: currentEnd,
      });

      currentStart = currentEnd;
    }

    if (slotsData.length === 0) {
      return NextResponse.json(
        { error: "No slots generated for given time range" },
        { status: 400 }
      );
    }

    const result = await prisma.slot.createMany({
      data: slotsData,
    });

    return NextResponse.json(
      {
        count: result.count,
      },
      { status: 201 }
    );
  } catch (e) {
    logger.error(`Error creating slots: ${e}`);
    return NextResponse.json(
      { error: "Error creating slots" },
      { status: 500 }
    );
  }
};

const deleteAllHandler: ApiHandler<object> = async () => {
  try {
    const result = await prisma.slot.deleteMany({
      where: {
        booking: null,
      },
    });
    return NextResponse.json({ deletedCount: result.count }, { status: 200 });
  } catch (e) {
    logger.error(`Error deleting all slots: ${e}`);
    return NextResponse.json(
      { error: "Error deleting all slots" },
      { status: 500 }
    );
  }
};

export const POST = withAuth(postHandler);
export const DELETE = withAuth(deleteAllHandler);
export const GET = withAuth(getHandler);
