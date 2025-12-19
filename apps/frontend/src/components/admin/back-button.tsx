"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";

const BackButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  const pathsWithoutBackButton = ["/admin"];
  const showBackButton = !pathsWithoutBackButton.includes(pathname);

  return (
    <div className="fixed bottom-8 left-8">
      {showBackButton && (
        <Button size="lg" variant="outline" onClick={() => router.back()}>
          <ChevronLeft />
          Zurück
        </Button>
      )}
    </div>
  );
};

export default BackButton;
