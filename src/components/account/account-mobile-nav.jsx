"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function AccountMobileNav() {
  const t = useTranslations();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      href: "/account",
      label: t("personal_info"),
      key: "personal_info",
    },
    {
      href: "/account/profile",
      label: t("profile"),
      key: "profile",
    },
    {
      href: "/account/cars",
      label: t("my_cars"),
      key: "cars",
    },
    {
      href: "/account/orders",
      label: t("my_orders"),
      key: "orders",
    },
    {
      href: "/account/addresses",
      label: t("my_addresses"),
      key: "addresses",
    },
    {
      href: "/account/referrals",
      label: t("referrals_bonuses"),
      key: "referrals",
    },
    {
      href: "/account/settings",
      label: t("settings"),
      key: "settings",
    },
    {
      href: "/account/notifications",
      label: t("notifications"),
      key: "notifications",
    },
  ];

  const isActive = (href) => {
    if (href === "/account") {
      return pathname === href || pathname.endsWith("/account");
    }
    return pathname?.endsWith(href);
  };

  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find((item) => isActive(item.href));
    return currentItem ? currentItem.label : t("personal_cabinet");
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="bg-white rounded-2xl p-4 ">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center gap-3">
            <Image
              src="/icons/menu.svg"
              alt="Menu"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <span className="text-base font-semibold text-gray-900">
              {getCurrentPageTitle()}
            </span>
          </div>
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar */}
          <div className="absolute right-0 top-0 bottom-0 w-full bg-white shadow-xl animate-slide-in-right">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-end p-6">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Menu Items */}
              <nav className="flex-1 overflow-y-auto p-2">
                {menuItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors mb-1 ${
                        active
                          ? "bg-[#00569C] text-white"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  );
                })}
                <div className="p-0 ">
                  <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors w-full">
                    <span className="text-sm font-medium">{t("logout")}</span>
                  </button>
                </div>
              </nav>

              {/* Logout Button */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
