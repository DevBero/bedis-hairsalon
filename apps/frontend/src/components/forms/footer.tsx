import { Button } from "../ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const FormFooter = ({
  onClick,
  disabled,
  loading,
  onBack,
  submit,
}: {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  onBack?: () => void;
  submit?: boolean;
}) => {
  return (
    <div
      className={cn(
        "mb-8 flex w-full px-3 flex-1 items-end",
        onBack ? "justify-between" : "justify-end"
      )}
    >
      {onBack && (
        <Button size="lg" variant="outline" onClick={onBack}>
          <ChevronLeft />
          Zurück
        </Button>
      )}
      <Button size="lg" onClick={onClick} disabled={disabled}>
        {submit ? loading ? <Spinner /> : "Termine erstellen" : "Weiter"}
      </Button>
    </div>
  );
};

export default FormFooter;
