"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { otpSchema } from "../validation-schemas";

export function PhoneOtpStep({
  phone,
  onSubmit,
  onResend,
  loading,
  error,
  timer,
  canResend,
}) {
  const t = useTranslations();

  const otpForm = useForm({
    resolver: yupResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatPhoneForDisplay = (phoneNumber) => {
    // Format: (050) 555 55 55
    if (phoneNumber.length >= 12) {
      const operator = phoneNumber.slice(3, 5);
      const part1 = phoneNumber.slice(5, 8);
      const part2 = phoneNumber.slice(8, 10);
      const part3 = phoneNumber.slice(10, 12);
      return `(0${operator}) ${part1} ${part2} ${part3}`;
    }
    return phoneNumber;
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-4">{t("otp")}</h2>
      <p className="text-center text-gray-600 mb-8">
        {t("phone_verification")}
      </p>
      <p className="text-center text-sm text-gray-500 mb-6">
        {formatPhoneForDisplay(phone)} {t("sms_code_sent")}
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
            placeholder={t("sms_code")}
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

        <div className="text-center text-gray-600 font-semibold text-lg">
          {formatTimer(timer)}
        </div>

        {canResend && (
          <button
            type="button"
            onClick={onResend}
            className="w-full text-blue-600 font-semibold"
          >
            {t("resend")}
          </button>
        )}

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



