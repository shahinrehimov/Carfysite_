"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { emailCheckSchema } from "../validation-schemas";
import Image from "next/image";
import { Link } from "@/i18n/routing";

export function EmailCheckStep({
  onSubmit,
  onAppleSignIn,
  onGoogleSignIn,
  loading,
  error,
}) {
  const t = useTranslations();

  const emailForm = useForm({
    resolver: yupResolver(emailCheckSchema),
    defaultValues: { email: "" },
  });

  const handleGoogleSignIn = () => {
    onGoogleSignIn?.();
  };

  const handleAppleSignIn = () => {
    onAppleSignIn?.();
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-8">{t("register")}</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={emailForm.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <input
            type="email"
            placeholder={t("email_address")}
            {...emailForm.register("email")}
            className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          />
          {emailForm.formState.errors.email && (
            <p className="text-xs text-red-600 mt-2 ml-4">
              {t(emailForm.formState.errors.email.message)}
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
          {loading ? t("sending") : t("continue")}
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
          disabled={loading}
          className="w-full px-6 py-4 rounded-full border-2 border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-3 font-semibold text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
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
          disabled={loading}
          className="w-full px-6 py-4 rounded-full border-2 border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-3 font-semibold text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
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
          {t("have_account")}{" "}
          <Link href="/auth/login" className="text-blue-600 font-semibold">
            {t("login")}
          </Link>
        </p>

        <p className="text-center text-xs text-gray-500 leading-relaxed">
          {t("register_terms_text")}{" "}
          <Link href="/pages/terms_of_use" className="text-blue-600 underline">
            {t("terms_of_use")}
          </Link>{" "}
          {t("and")}{" "}
          <Link
            href="/pages/privacy_policy"
            className="text-blue-600 underline"
          >
            {t("privacy_policy")}
          </Link>{" "}
          {t("agree_with")}.
        </p>
      </form>
    </div>
  );
}
