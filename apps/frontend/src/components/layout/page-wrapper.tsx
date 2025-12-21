import { cn } from "@/lib/utils";
import React from "react";

const PageWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn(className, "w-full p-3")}>{children}</div>;
};

export default PageWrapper;
