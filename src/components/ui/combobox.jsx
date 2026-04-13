"use client";

import * as React from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

// Single-select combobox
function SingleCombobox({
  options = [],
  value,
  onValueChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  className,
  triggerClassName,
  disabled = false,
}) {
  const [open, setOpen] = React.useState(false);
  const selectedOption = options.find((option) => option.value === value);

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
            {selectedOption ? selectedOption.label : placeholder}
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
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
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

// Multi-select combobox
function MultiCombobox({
  options = [],
  value = [],
  onValueChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  className,
  triggerClassName,
  disabled = false,
  selectedCountLabel = "seçilib",
}) {
  const [open, setOpen] = React.useState(false);

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
    return `${value.length} ${selectedCountLabel}`;
  }, [value, options, selectedCountLabel]);

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
            {triggerLabel ?? placeholder}
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
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
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
