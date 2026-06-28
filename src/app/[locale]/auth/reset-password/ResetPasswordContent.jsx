"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/axios";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ResetPasswordStep } from "./ResetPasswordStep";
import { SuccessStep } from "./SuccessStep";

export function ResetPasswordContent() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [step, setStep] = useState("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data) => {
    setError("");
    setLoading(true);

    try {
      await api.post(
        "/reset-password",
        {
          password: data.password,
          password_confirmation: data.password_confirmation,
        },
        {
          params: {
            token,
            email,
          },
        }
      );

      setStep("success");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          t("reset_password_failed")
      );
    } finally {
      setLoading(false);
    }
  };

  const isInvalidLink = !token || !email;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-2xl min-h-[600px] bg-[#E8F1FC] rounded-[80px] shadow-[0px_1px_8px_0px_#00000029] overflow-hidden flex flex-col">
        <div className="py-5 text-center font-semibold text-[#4A7FBF] rounded-t-[80px]">
          {t("reset_password")}
        </div>

        <div className="flex-1 bg-white w-full flex items-center justify-center">
          <div className="p-8 md:p-12 w-full">
            {isInvalidLink ? (
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">
                  {t("invalid_reset_link")}
                </h2>
                <p className="text-gray-600 text-sm mb-8">
                  {t("invalid_reset_link_description")}
                </p>
                <Link
                  href="/auth/forgot-password"
                  className="text-blue-600 font-semibold"
                >
                  {t("forgot_password")}
                </Link>
              </div>
            ) : step === "form" ? (
              <ResetPasswordStep
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
                email={email}
              />
            ) : (
              <SuccessStep />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
