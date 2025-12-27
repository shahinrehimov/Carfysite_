"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useCart } from "@/contexts/cart-context";
import { usePathname } from "next/navigation";
import MobileCategoriesModal from "@/components/categories/mobile-categories-modal";
import { isAuthenticated } from "@/lib/auth";

export default function MobileNav() {
  const t = useTranslations();
  const { getCartCount } = useCart();
  const pathname = usePathname();
  const cartCount = getCartCount();
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check authentication status on mount
    setIsLoggedIn(isAuthenticated());

    // Listen for storage events (login/logout in other tabs)
    const handleStorageChange = () => {
      setIsLoggedIn(isAuthenticated());
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

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
      href: isLoggedIn ? "/account" : "/auth/login",
      icon: "/icons/user.svg",
      label: isLoggedIn ? t("account") : t("login"),
      key: "profile",
    },
  ];

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const isCategories = item.key === "categories";

            if (isCategories) {
              return (
                <button
                  key={item.key}
                  onClick={() => setIsCategoriesModalOpen(true)}
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
                  </div>
                  <span
                    className={`text-[10px] ${active ? "font-medium" : ""}`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            }

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
                </div>
                <span className={`text-[10px] ${active ? "font-medium" : ""}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <MobileCategoriesModal
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
      />
    </>
  );
}
