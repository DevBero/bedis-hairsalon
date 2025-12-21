export const dynamic = "force-dynamic";

import SlotsList from "@/components/slots/slots-list";
import { SlotService } from "@/lib/slot-service";
import { GetSlotsQueryDTO } from "@/lib/dtos/slots-query.dto";
import PageWrapper from "@/components/layout/page-wrapper";
import ActionButton from "@/components/admin/action-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus } from "lucide-react";
import Link from "next/link";

type AdminPageProps = {
  searchParams: GetSlotsQueryDTO;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const slots = await SlotService.instance.list(searchParams);

  return (
    <PageWrapper>
      <SlotsList slots={slots} />
      <ActionButton>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon-lg">
              <Plus />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuItem asChild>
              <Link href="/admin/create-slots?t=0">Termin anlegen</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ActionButton>
    </PageWrapper>
  );
}
