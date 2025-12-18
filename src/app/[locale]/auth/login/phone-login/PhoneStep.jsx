"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { phoneSchema } from "../validation-schemas";
import { Link } from "@/i18n/routing";
import Image from "next/image";

export function PhoneStep({ onSubmit, loading, error }) {
  const t = useTranslations();

  const phoneForm = useForm({
    resolver: yupResolver(phoneSchema),
    defaultValues: { phone: "" },
  });

  const handleGoogleSignIn = () => {
    // TODO: Implement Google OAuth
    console.log("Google sign in");
  };

  const handleAppleSignIn = () => {
    // TODO: Implement Apple OAuth
    console.log("Apple sign in");
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-8">
        {t("cabinet_login")}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={phoneForm.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
              +994
            </span>
            <input
              type="text"
              placeholder={t("mobile_number")}
              value={
                phoneForm.watch("phone")
                  ? phoneForm.watch("phone").substring(3)
                  : ""
              }
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                const fullPhone = "994" + value;
                phoneForm.setValue("phone", fullPhone, {
                  shouldValidate: true,
                });
              }}
              className="w-full pl-20 pr-6 py-4 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              maxLength={9}
            />
          </div>
          {phoneForm.formState.errors.phone && (
            <p className="text-xs text-red-600 mt-2 ml-4">
              {t(phoneForm.formState.errors.phone.message)}
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
          {loading ? t("sending") : t("proceed")}
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">{t("or")}</span>
          </div>
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full px-6 py-4 rounded-full border-2 border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-3 font-semibold text-gray-900"
        >
          <Image
            src="/icons/google-icon.svg"
            alt="Google"
            width={24}
            height={24}
          />
          Google
        </button>

        {/* Apple Sign In */}
        <button
          type="button"
          onClick={handleAppleSignIn}
          className="w-full px-6 py-4 rounded-full border-2 border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-3 font-semibold text-gray-900"
        >
          <Image
            src="/icons/apple-icon.svg"
            alt="Apple"
            width={24}
            height={24}
          />
          Apple
        </button>

        <p className="text-center text-gray-600 text-sm">
          {t("no_account")}{" "}
          <Link href="/auth/register" className="text-blue-600 font-semibold">
            {t("register_now")}
          </Link>
        </p>

        <p className="text-center text-xs text-gray-500 leading-relaxed">
          {t("register_terms_text")}{" "}
          <Link href="/terms" className="text-blue-600 underline">
            {t("terms_of_use")}
          </Link>{" "}
          {t("and")}{" "}
          <Link href="/privacy" className="text-blue-600 underline">
            {t("privacy_policy")}
          </Link>{" "}
          {t("agree_with")}.
        </p>
      </form>
    </div>
  );
}
