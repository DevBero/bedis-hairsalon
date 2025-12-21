import React from "react";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const FormFooter = ({
  onClick,
  disabled,
  onBack,
  submit,
}: {
  onClick: () => void;
  disabled?: boolean;
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
      <Button
        className={cn(submit ? "bg-green-800" : "")}
        size="lg"
        onClick={onClick}
        disabled={disabled}
      >
        {submit ? "Termine erstellen" : "Weiter"}
      </Button>
    </div>
  );
};

export default FormFooter;
