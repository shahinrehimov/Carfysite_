"use client";

import * as React from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function SingleCombobox({
  options = [],
  value,
  onValueChange,
  placeholder,
  searchPlaceholder,
  emptyText,
  className,
  triggerClassName,
  disabled = false,
}) {
  const t = useTranslations();
  const [open, setOpen] = React.useState(false);
  const selectedOption = options.find((option) => option.value === value);
  const resolvedPlaceholder = placeholder ?? t("select");
  const resolvedSearchPlaceholder = searchPlaceholder ?? t("search");
  const resolvedEmptyText = emptyText ?? t("no_results_found");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "justify-between bg-white text-[#00569C] hover:bg-white hover:text-[#00569C]",
            triggerClassName,
            className
          )}
        >
          <span className={cn("text-left truncate", !value && "text-[#00569C80]")}>
            {selectedOption ? selectedOption.label : resolvedPlaceholder}
          </span>
          {open ? (
            <ChevronUp className="ml-2 h-5 w-5 shrink-0 text-[#3696E7]" />
          ) : (
            <ChevronDown className="ml-2 h-5 w-5 shrink-0 text-[#3696E7]" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder={resolvedSearchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{resolvedEmptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  keywords={[option.value]}
                  onSelect={() => {
                    onValueChange(option.value === value ? "" : option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function MultiCombobox({
  options = [],
  value = [],
  onValueChange,
  placeholder,
  searchPlaceholder,
  emptyText,
  className,
  triggerClassName,
  disabled = false,
  selectedCountLabel,
}) {
  const t = useTranslations();
  const [open, setOpen] = React.useState(false);
  const resolvedPlaceholder = placeholder ?? t("select");
  const resolvedSearchPlaceholder = searchPlaceholder ?? t("search");
  const resolvedEmptyText = emptyText ?? t("no_results_found");
  const resolvedSelectedCountLabel = selectedCountLabel ?? t("selected_count_suffix");

  const toggle = (optionValue) => {
    if (value.includes(optionValue)) {
      onValueChange(value.filter((v) => v !== optionValue));
    } else {
      onValueChange([...value, optionValue]);
    }
  };

  const triggerLabel = React.useMemo(() => {
    if (!value.length) return null;
    if (value.length === 1) {
      return options.find((o) => o.value === value[0])?.label ?? value[0];
    }
    return `${value.length} ${resolvedSelectedCountLabel}`;
  }, [value, options, resolvedSelectedCountLabel]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "justify-between bg-white text-[#00569C] hover:bg-white hover:text-[#00569C]",
            triggerClassName,
            className
          )}
        >
          <span className={cn("text-left truncate", !triggerLabel && "text-[#00569C80]")}>
            {triggerLabel ?? resolvedPlaceholder}
          </span>
          {open ? (
            <ChevronUp className="ml-2 h-5 w-5 shrink-0 text-[#3696E7]" />
          ) : (
            <ChevronDown className="ml-2 h-5 w-5 shrink-0 text-[#3696E7]" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder={resolvedSearchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{resolvedEmptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  keywords={[option.value]}
                  onSelect={() => toggle(option.value)}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function Combobox({ multiple = false, ...props }) {
  if (multiple) return <MultiCombobox {...props} />;
  return <SingleCombobox {...props} />;
}
