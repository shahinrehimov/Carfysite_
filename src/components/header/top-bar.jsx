"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import LangSwitcher from "./lang-switcher";
import { X } from "lucide-react";

export default function TopBar({ phone }) {
  const t = useTranslations();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { label: t("about-us"), href: "/about" },
    { label: t("legal-information"), href: "/legal" },
    { label: t("carfy-rules"), href: "/rules" },
    { label: t("contact"), href: "/contact" },
  ];

  return (
    <>
      <div className="bg-light-blue w-full py-2 rounded-b-[40px] lg:rounded-b-[200px] relative z-20">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="w-[70px] lg:w-[140px] shrink-0">
              <Link href="/">
                <Image
                  src="/images/logo.svg"
                  alt="logo"
                  width={140}
                  height={50}
                  className="w-full h-full object-contain"
                />
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <div className="block lg:hidden shrink-0">
                <Link href={`tel:${phone}`} className="flex items-center gap-2">
                  <Image
                    src="/icons/phone-primary.svg"
                    alt="phone"
                    width={20}
                    height={20}
                    className="w-[20px] h-[20px] object-contain"
                  />
                  <span className="text-[#00569C] text-sm font-regular">
                    {t("call-us")}
                  </span>
                </Link>
              </div>
              <LangSwitcher />
              <div className="hidden lg:block shrink-0">
                <Button
                  asChild
                  variant="primary"
                  size="lg"
                  className={"lg:min-w-[220px]"}
                >
                  <Link href="tel:+994501234567">
                    <Image
                      src="/icons/phone.svg"
                      alt="phone"
                      width={20}
                      height={20}
                      className="w-[20px] h-[20px] object-contain"
                    />
                    <span className="text-base font-regular">
                      {t("call-us")}
                    </span>
                  </Link>
                </Button>
              </div>
              <div className="block lg:hidden shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMenu}
                  className="cursor-pointer"
                  aria-label={t("menu")}
                  aria-expanded={isMenuOpen}
                >
                  <Image
                    src="/icons/menu.svg"
                    alt="menu"
                    width={20}
                    height={20}
                    className="w-[24px] h-[24px] object-contain"
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed top-0 left-0 right-0 bottom-0 bg-white z-50 transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen
            ? "translate-x-0 pointer-events-auto"
            : "translate-x-full pointer-events-none"
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className="container pt-6 px-6 h-full flex items-center">
          <div className="flex flex-col w-full">
            <button
              type="button"
              onClick={toggleMenu}
              className="absolute top-6 right-6 text-[#00569C] cursor-pointer p-2"
              aria-label={t("close")}
            >
              <X size={28} strokeWidth={1.5} />
            </button>

            <div className="w-full">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={toggleMenu}
                  className="py-4 text-[#1A1A1A] text-base font-regular  flex items-center justify-between group"
                >
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
