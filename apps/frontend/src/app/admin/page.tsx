"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const Admin = () => {
  return (
    <div className="flex flex-1 h-full p-4">
      {/* HERE COMES THE ADMIN PANEL */}
      <Button onClick={() => signOut({ callbackUrl: "/login" })}>
        Abmelden
      </Button>
    </div>
  );
};

export default Admin;
