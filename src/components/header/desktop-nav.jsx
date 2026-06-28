"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import CartDropdown from "@/components/cart/cart-dropdown";
import { isAuthenticated } from "@/lib/auth";
import { notificationsService } from "@/lib/notificationsService";

export default function DesktopNav() {
  const t = useTranslations();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCity] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationsService.getUnreadCount();
      setUnreadCount(res.data?.count ?? 0);
    } catch {
      // silently ignore
    }
  };

  useEffect(() => {
    const loggedIn = isAuthenticated();
    setIsLoggedIn(loggedIn);
    if (loggedIn) fetchUnreadCount();

    const handleStorageChange = () => {
      const auth = isAuthenticated();
      setIsLoggedIn(auth);
      if (auth) fetchUnreadCount();
      else setUnreadCount(0);
    };

    const handleNotificationRead = (e) => {
      const count = e.detail?.count ?? 1;
      setUnreadCount((prev) => Math.max(0, prev - count));
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authChange", handleStorageChange);
    window.addEventListener("notificationRead", handleNotificationRead);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleStorageChange);
      window.removeEventListener("notificationRead", handleNotificationRead);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { label: t("about-us"), href: "/about" },
    { label: t("legal-information"), href: "/pages/legal" },
    { label: t("carfy-rules"), href: "/pages/rules" },
    { label: t("contact"), href: "/contact" },
  ];

  return (
    <div className="hidden lg:flex items-center justify-between w-full gap-6">
      {/* Menu Button with Dropdown */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="flex items-center gap-2 text-[#1A1A1A] link-hover"
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
                    className="block px-4 py-2 text-sm text-[#1A1A1A] hover:bg-gray-100 transition-interactive"
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
            <span className="text-sm">{selectedCity ?? t("default_city")}</span>
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Link
          href="/account/notifications"
          className="flex items-center gap-2 text-[#1A1A1A] link-hover"
        >
          <div className="relative">
            <Image
              src="/icons/notification.svg"
              alt="notifications"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-0.5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full leading-none">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
          <span className="text-sm">{t("notifications")}</span>
        </Link>

        <Link
          href="/messages"
          className="flex items-center gap-2 text-[#1A1A1A] link-hover"
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
          href="/wishlist"
          className="flex items-center gap-2 text-[#1A1A1A] link-hover"
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

        {isLoggedIn ? (
          <Link
            href="/account"
            className="flex items-center gap-2 text-[#1A1A1A] link-hover"
          >
            <Image
              src="/icons/user.svg"
              alt="account"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span className="text-sm">{t("account")}</span>
          </Link>
        ) : (
          <Link
            href="/auth/login"
            className="flex items-center gap-2 text-[#1A1A1A] link-hover"
          >
            <Image
              src="/icons/user.svg"
              alt="login"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span className="text-sm">{t("login")}</span>
          </Link>
        )}

        <CartDropdown />
      </div>
    </div>
  );
}
