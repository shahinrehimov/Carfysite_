"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import CartDropdown from "@/components/cart/cart-dropdown";

export default function DesktopNav() {
  const t = useTranslations();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Bakı");

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
    <div className="hidden lg:flex items-center justify-between w-full gap-6">
      {/* Menu Button with Dropdown */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="flex items-center gap-2 text-[#1A1A1A] "
          >
            <Image
              src="/icons/menu.svg"
              alt="menu"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span className="text-sm font-medium">{t("menu")}</span>
          </button>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsMenuOpen(false)}
              />

              <div className="absolute top-full left-0 mt-2  rounded-lg shadow-lg py-2 backdrop-blur-[32px] min-w-[200px] z-40 bg-[#FFFFFF8F]">
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-[#1A1A1A] hover:bg-gray-100 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 text-[#1A1A1A]">
          <Image
            src="/icons/location.svg"
            alt="location"
            width={20}
            height={20}
            className="w-5 h-5"
          />
          <span className="text-sm">{t("city")}:</span>
          <button className="flex items-center gap-1 font-medium ">
            <span className="text-sm">{selectedCity}</span>
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Link
          href="/notifications"
          className="flex items-center gap-2 text-[#1A1A1A] "
        >
          <Image
            src="/icons/notification.svg"
            alt="notifications"
            width={20}
            height={20}
            className="w-5 h-5"
          />
          <span className="text-sm">{t("notifications")}</span>
        </Link>

        <Link
          href="/messages"
          className="flex items-center gap-2 text-[#1A1A1A] "
        >
          <Image
            src="/icons/message.svg"
            alt="messages"
            width={20}
            height={20}
            className="w-5 h-5"
          />
          <span className="text-sm">{t("messages")}</span>
        </Link>

        <Link
          href="/favorites"
          className="flex items-center gap-2 text-[#1A1A1A] "
        >
          <Image
            src="/icons/heart.svg"
            alt="favorites"
            width={20}
            height={20}
            className="w-5 h-5"
          />
          <span className="text-sm">{t("favorites")}</span>
        </Link>

        <Link href="/login" className="flex items-center gap-2 text-[#1A1A1A] ">
          <Image
            src="/icons/user.svg"
            alt="login"
            width={20}
            height={20}
            className="w-5 h-5"
          />
          <span className="text-sm">{t("login")}</span>
        </Link>

        <CartDropdown />
      </div>
    </div>
  );
}
