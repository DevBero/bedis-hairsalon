import { ApiHandler, AuthenticatedRequest } from "./types";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { getLogger } from "@/lib/logger";
import { authOptions } from "./auth-options";
import { GroupType } from "../entities/user-group";

const logger = getLogger("withAuth");

export type WithAuthProps<T> =
  | {
      handler: ApiHandler<T>;
      allowedGroups: GroupType[];
    }
  | {
      handler: ApiHandler<T>;
      publicEndpoint: true;
    };

export function withAuth<T = object>(props: WithAuthProps<T>) {
  return async (
    req: NextRequest,
    { params }: { params: Promise<T> }
  ): Promise<Response> => {
    try {
      const session = await getServerSession(authOptions);
      if (!session) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (
        "allowedGroups" in props &&
        !session.user.groups.some((group: GroupType) =>
          props.allowedGroups.includes(group)
        )
      ) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }

      const authenticatedReq = req as AuthenticatedRequest;
      authenticatedReq.session = session;

      return await props.handler(authenticatedReq, await params);
    } catch (error) {
      logger.error("Auth middleware error:");
      logger.error(error);
      return Response.json({ error: "Internal server error" }, { status: 500 });
    }
  };
}
