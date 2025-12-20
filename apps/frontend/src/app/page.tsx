import NameForm from "@/components/forms/name-form";
// import { SlotService } from "@/lib/slot-service";
export const dynamic = "force-dynamic";

export default async function Home() {
  // const now = new Date();
  // const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  // const slots = await SlotService.instance.list({
  //   start_date: now.toISOString(),
  //   end_date: in7Days.toISOString(),
  // });

  return (
    <div className="flex w-full flex-col items-center justify-center p-6 h-screen gap-6">
      <NameForm />
    </div>
  );
}
