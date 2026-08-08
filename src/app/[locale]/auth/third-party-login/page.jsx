"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { loginWithThirdParty, saveAuthSession } from "@/lib/authService";

export default function ThirdPartyLoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const provider = searchParams.get("provider");

    if (!token || !provider) {
      setError(t("login_failed"));
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const data = await loginWithThirdParty(token, provider);
        if (cancelled) return;

        if (saveAuthSession(data)) {
          router.replace("/");
        } else {
          setError(t("login_failed"));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || t("login_failed"));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams, router, t]);

  if (error) {
    return (
      <div className="min-h-0 flex items-center justify-center p-4 py-10 lg:min-h-[70vh] bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 text-center">
          <p className="text-red-600 mb-6">{error}</p>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#4A7FBF] text-white font-semibold hover:bg-[#3d6ba3] transition-colors"
          >
            {t("cabinet_login")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex items-center justify-center p-4 py-10 lg:min-h-[70vh] bg-gray-50">
      <p className="text-gray-600 font-medium">{t("logging_in")}</p>
    </div>
  );
}
