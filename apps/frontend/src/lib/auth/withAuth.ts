import { ApiHandler, AuthenticatedRequest } from "./types";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { getLogger } from "@/lib/helper/logger";
import { authOptions } from "./auth-options";

const logger = getLogger("withAuth");

export function withAuth<T = object>(handler: ApiHandler<T>) {
  return async (
    req: NextRequest,
    { params }: { params: Promise<T> }
  ): Promise<Response> => {
    try {
      const session = await getServerSession(authOptions);

      if (!session) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }

      const authenticatedReq = req as AuthenticatedRequest;
      authenticatedReq.session = session;

      return await handler(authenticatedReq, await params);
    } catch (error) {
      logger.error("Auth middleware error:");
      logger.error(error);
      return Response.json({ error: "Internal server error" }, { status: 500 });
    }
  };
}
