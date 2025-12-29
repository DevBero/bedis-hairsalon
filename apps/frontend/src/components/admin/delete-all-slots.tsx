"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const DeleteAllSlotsItem = () => {
  const router = useRouter();

  const handleDeleteAll = async () => {
    const confirmed = window.confirm(
      "Willst du wirklich alle Termine löschen? Dieser Vorgang kann nicht rückgängig gemacht werden."
    );
    if (!confirmed) return;

    try {
      const res = await fetch("/api/slot", {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg = data?.error ?? "Fehler beim Löschen der Termine.";
        toast.error(msg);
        return;
      }

      toast.success("Alle Termine wurden gelöscht.");
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error("Ups, da ist etwas schief gelaufen.");
    }
  };

  return (
    <DropdownMenuItem onClick={handleDeleteAll}>
      <Trash color="var(--destructive)" />
      Alle Termine löschen
    </DropdownMenuItem>
  );
};

export default DeleteAllSlotsItem;
