"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

const languages = {
  az: { code: "AZ", name: "Azərbaycan" },
  en: { code: "EN", name: "English" },
  ru: { code: "RU", name: "Русский" },
};

export default function LangSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (newLocale) => {
    setIsOpen(false);
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 lg:gap-3 bg-white rounded-full px-2 lg:px-6 py-1 lg:py-4 hover:bg-white/90 transition-colors lg:min-w-[140px]"
        aria-label="Select language"
      >
        <Image
          src="/icons/globe.svg"
          alt="globe"
          width={20}
          height={20}
          className="w-[16px] h-[16px] lg:w-[20px] lg:h-[20px] object-contain"
        />
        <span className="text-sm lg:text-base font-regular text-blue flex-1 text-center">
          {languages[locale].code}
        </span>
        <ChevronDown
          className={`w-4 h-4 lg:w-5 lg:h-5 text-blue transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-lg overflow-hidden z-50 min-w-[160px] border border-gray-100">
          {routing.locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleLanguageChange(loc)}
              className={`w-full px-4 py-3 text-left hover:bg-light-blue transition-colors flex items-center gap-3 ${
                locale === loc ? "bg-light-blue/50" : ""
              }`}
            >
              <span className="text-sm font-semibold text-blue">
                {languages[loc].code}
              </span>
              <span className="text-sm text-gray-700">
                {languages[loc].name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
