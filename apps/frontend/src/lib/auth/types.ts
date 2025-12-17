import { Session } from "next-auth";

export interface AuthenticatedRequest extends Request {
  session?: Session;
}

export type ApiHandler<T> = (
  req: AuthenticatedRequest,
  params: T
) => Promise<Response>;
