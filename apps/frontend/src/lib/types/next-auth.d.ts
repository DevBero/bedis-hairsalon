import { DefaultSession } from "next-auth";
import { GroupType } from "@/lib/entities/UserGroup";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      sub: string;
      groups: GroupType[];
    } & DefaultSession["user"];
  }
}
