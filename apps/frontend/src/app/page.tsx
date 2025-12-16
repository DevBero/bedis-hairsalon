"use client";

import NameForm from "@/components/forms/name-form";

export default function Home() {
  return (
    <div className="flex w-full flex-col items-center justify-center p-6 h-screen">
      <NameForm />
      {/* <TimeSlots/> */}
    </div>
  );
}
