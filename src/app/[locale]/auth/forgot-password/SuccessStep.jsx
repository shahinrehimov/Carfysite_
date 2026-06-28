"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import Image from "next/image";

export function SuccessStep({ email }) {
  const t = useTranslations();

  return (
    <div className="text-center py-4">
      <div className="mb-8 flex justify-center">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
          <Image
            src="/images/register-success.svg"
            alt="success"
            width={72}
            height={72}
            className="w-16 h-16 object-contain"
          />
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-4">
        {t("password_reset_sent")}
      </h2>
      <p className="text-gray-600 text-sm mb-2">
        {t("password_reset_sent_description")}
      </p>
      {email && (
        <p className="text-[#4A7FBF] font-semibold text-sm mb-8">{email}</p>
      )}

      <Button variant="primary" size="lg" className="w-full" asChild>
        <Link href="/auth/login">{t("back_to_login")}</Link>
      </Button>
    </div>
  );
}
