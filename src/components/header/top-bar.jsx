import { Link } from "@/i18n/routing";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { getTranslations } from "next-intl/server";
import LangSwitcher from "./lang-switcher";
export default async function TopBar() {
  const t = await getTranslations();

  return (
    <div className="bg-light-blue w-full py-2 rounded-b-[40px] lg:rounded-b-[200px]">
      <div className="container">
        <div className="flex items-center justify-between">
          <div className="w-[70px] lg:w-[140px]">
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

          <div className="flex items-center gap-4">
            <LangSwitcher />
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
                <span className="text-base font-regular">{t("call-us")}</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
