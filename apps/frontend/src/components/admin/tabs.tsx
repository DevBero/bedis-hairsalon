import React from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

const AdminTabs = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs defaultValue="buchungen">
        <TabsList className="w-full h-12">
          <TabsTrigger value="buchungen">Buchungen</TabsTrigger>
          <TabsTrigger value="termine">Termine</TabsTrigger>
        </TabsList>
        {children}
      </Tabs>
    </div>
  );
};

export default AdminTabs;
