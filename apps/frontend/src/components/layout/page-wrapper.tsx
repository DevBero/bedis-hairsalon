import React from "react";

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full p-3">{children}</div>;
};

export default PageWrapper;
