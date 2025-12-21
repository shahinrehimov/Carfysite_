"use client";

import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function AccountSidebar() {
  const t = useTranslations();
  const pathname = usePathname();

  const menuItems = [
    {
      href: "/account",
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
    {
      href: "#",
      label: t("logout"),
      key: "logout",
      isLogout: true,
    },
  ];

  const isActive = (href) => {
    if (href === "/account") {
      return pathname === href || pathname.endsWith("/account");
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="bg-white  border-r border-gray-200 overflow-hidden">
      <div className="py-3 px-6 ">
        <h2 className="text-lg font-semibold text-gray-900">
          {t("personal_cabinet")}
        </h2>
      </div>

      <nav className="p-2">
        {menuItems.map((item) => {
          const active = isActive(item.href);

          if (item.isLogout) {
            return (
              <button
                key={item.key}
                className="flex items-center  px-4 py-3 group"
              >
                <span className="text-lg font-medium text-gray-700 group-hover:text-danger cursor-pointer">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors  ${
                active
                  ? "text-[#00569C] font-semibold "
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="text-lg font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
