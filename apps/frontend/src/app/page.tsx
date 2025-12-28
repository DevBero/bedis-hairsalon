import NameForm from "@/components/forms/name-form";
export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <div className="flex w-full flex-col items-center justify-center p-6 h-screen gap-6">
      <NameForm />
    </div>
  );
}
