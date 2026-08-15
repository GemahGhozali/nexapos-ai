"use client";

import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar04Icon } from "@hugeicons/core-free-icons";
import { id as indonesia } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
  id: string;
  value?: Date;
  invalid: boolean;
  onChange: (date?: Date) => void;
  onBlur: () => void;
}

export function DatePicker({ id, value, invalid, onChange, onBlur }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (!isOpen && !value) onBlur();
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            variant="outline"
            data-empty={!value}
            aria-invalid={invalid}
            className="justify-start text-left font-normal data-[empty=true]:text-muted-foreground aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
          />
        }
      >
        <HugeiconsIcon icon={Calendar04Icon} size={16} color="currentColor" className="mr-1" strokeWidth={1.5} />
        {value ? format(value, "EEEE, d MMMM yyyy", { locale: indonesia }) : <span>Pilih tanggal disini...</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date);
            setIsOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
