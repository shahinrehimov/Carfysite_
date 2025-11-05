"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";
import { useCart } from "@/contexts/cart-context";
import { usePathname } from "next/navigation";

export default function MobileNav() {
  const t = useTranslations();
  const { getCartCount } = useCart();
  const pathname = usePathname();
  const cartCount = getCartCount();

  const isActive = (path) => {
    return pathname?.includes(path);
  };

  const navItems = [
    {
      href: "/categories",
      icon: "/icons/category.svg",
      label: t("categories"),
      key: "categories",
    },
    {
      href: "/messages",
      icon: "/icons/message.svg",
      label: t("messages"),
      key: "messages",
    },
    {
      href: "/favorites",
      icon: "/icons/heart.svg",
      label: t("favorites"),
      key: "favorites",
    },
    {
      href: "/cart",
      icon: "/icons/cart.svg",
      label: t("cart"),
      key: "cart",
      badge: cartCount,
    },
    {
      href: "/profile",
      icon: "/icons/user.svg",
      label: t("login"),
      key: "profile",
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[60px] py-1 transition-colors ${
                active ? "text-[#00569C]" : "text-[#1A1A1A]"
              }`}
            >
              <div className="relative mb-1">
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={24}
                  height={24}
                  className={`w-6 h-6 ${
                    active ? "brightness-0 saturate-100" : ""
                  }`}
                  style={
                    active
                      ? {
                          filter:
                            "invert(23%) sepia(92%) saturate(1234%) hue-rotate(181deg) brightness(96%) contrast(101%)",
                        }
                      : {}
                  }
                />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF6B35] text-white text-[10px] font-semibold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] ${active ? "font-medium" : ""}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
