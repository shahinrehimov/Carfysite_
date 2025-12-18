"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { otpSchema } from "../validation-schemas";

export function EmailVerifyStep({ email, onSubmit, loading, error }) {
  const t = useTranslations();

  const otpForm = useForm({
    resolver: yupResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const maskEmail = (email) => {
    if (!email) return "";
    const [localPart, domain] = email.split("@");
    const visibleChars = Math.min(5, localPart.length);
    const masked =
      localPart.substring(0, visibleChars) +
      "*".repeat(Math.max(0, localPart.length - visibleChars));
    return `${masked}@${domain}`;
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-4">
        {t("email_verification")}
      </h2>
      <p className="text-center text-sm text-gray-600 mb-2">
        {maskEmail(email)} {t("email_verification_code_sent")}
      </p>
      <p className="text-center text-xs text-gray-500 mb-8">
        {t("please_enter_4_digit_code")}
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={otpForm.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <input
            type="text"
            placeholder={t("code")}
            {...otpForm.register("otp")}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              otpForm.setValue("otp", value);
            }}
            className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-center text-2xl tracking-widest"
            maxLength={4}
          />
          {otpForm.formState.errors.otp && (
            <p className="text-xs text-red-600 mt-2 text-center">
              {t(otpForm.formState.errors.otp.message)}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          size="lg"
          className="w-full"
        >
          {loading ? t("verifying") : t("verify")}
        </Button>
      </form>
    </div>
  );
}
