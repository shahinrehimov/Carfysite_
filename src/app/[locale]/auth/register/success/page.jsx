"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Link } from "@/i18n/routing";

export default function SuccessPage() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-2xl bg-white rounded-[80px] shadow-[0px_1px_8px_0px_#00000029] p-12">
        <div className="text-center py-12">
          <div className="mb-8 flex justify-center">
            <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
              <Image
                src="/images/register-success.svg"
                alt="success"
                width={100}
                height={100}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-4">
            {t("registration_completed")}
          </h2>
          <p className="text-gray-600 mb-8">
            {t("registration_success_message")}
          </p>

          <Button
            onClick={() => router.push("/login")}
            variant="primary"
            size="lg"
            className="mt-8 w-full"
            asChild
          >
            <Link href="/auth/login">{t("login")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
