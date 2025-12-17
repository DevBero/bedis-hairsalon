"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function LoginRedirectPage() {
  return (
    <div className="flex items-center justify-center min-h-screen flex-col w-full">
      <h1 className="text-5xl font-bold mb-4">Bedis Hairsalon</h1>
      <p className="text-gray-700">
        Sieht so aus als wärst du nicht angemeldet...
      </p>
      <Button
        size="lg"
        className="mt-4"
        onClick={() => signIn("cognito", { callbackUrl: "/admin" })}
      >
        Jetzt Anmelden
      </Button>
    </div>
  );
}
