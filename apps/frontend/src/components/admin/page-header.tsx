"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const PageHeader = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getHeaderTitle = () => {
    const t = searchParams.get("t");

    if (pathname === "/admin/create-slots" && t === "0") {
      return <span className="text-xl">1. Datum wählen</span>;
    }

    if (pathname === "/admin/create-slots" && t === "1") {
      return <span className="text-xl">2. Zeitspanne festlegen</span>;
    }

    if (pathname === "/admin/create-slots" && t === "2") {
      return <span className="text-xl">3. Bestätigen</span>;
    }

    return (
      <span className="text-xl">
        Hi, <strong>Bedirhan</strong>
      </span>
    );
  };

  return (
    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
      {getHeaderTitle()}
      <Avatar>
        <AvatarImage
          src="/bedirhan.jpg"
          alt="Admin Avatar"
          className="object-cover"
        />
        <AvatarFallback>BH</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default PageHeader;
