"use client";

import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const PageHeader = () => {
  const pathName = usePathname();

  const getHeaderTitle = () => {
    switch (pathName) {
      case "/admin/create-slots":
        return <span className="text-xl">Termin anlegen </span>;
      default:
        return (
          <span className="text-xl">
            Hi, <strong>Bedirhan</strong>
          </span>
        );
    }
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
