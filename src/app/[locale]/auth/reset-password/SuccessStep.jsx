"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import Image from "next/image";

export function SuccessStep() {
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
        {t("password_reset_success") || "Şifrə yeniləndi"}
      </h2>
      <p className="text-gray-600 text-sm mb-8">
        {t("password_reset_success_description") ||
          "Yeni şifrənizlə hesabınıza daxil ola bilərsiniz."}
      </p>

      <Button variant="primary" size="lg" className="w-full" asChild>
        <Link href="/auth/login">{t("login")}</Link>
      </Button>
    </div>
  );
}
