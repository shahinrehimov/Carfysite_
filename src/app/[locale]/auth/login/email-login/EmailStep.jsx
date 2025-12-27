"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { emailLoginSchema } from "../validation-schemas";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useState } from "react";

export function EmailStep({ onSubmit, loading, error }) {
  const t = useTranslations();
  const [showPassword, setShowPassword] = useState(false);

  const emailForm = useForm({
    resolver: yupResolver(emailLoginSchema),
    defaultValues: { email: "", password: "" },
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

      <form onSubmit={emailForm.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <input
            type="email"
            placeholder={t("email")}
            {...emailForm.register("email")}
            className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          />
          {emailForm.formState.errors.email && (
            <p className="text-xs text-red-600 mt-2 ml-4">
              {t(emailForm.formState.errors.email.message)}
            </p>
          )}
        </div>

        <div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t("password")}
              {...emailForm.register("password")}
              className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {showPassword ? (
                  <path
                    d="M12 5C5.63636 5 2 12 2 12C2 12 5.63636 19 12 19C18.3636 19 22 12 22 12C22 12 18.3636 5 12 5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <>
                    <path
                      d="M2 2L22 22"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12 5C5.63636 5 2 12 2 12C2 12 5.63636 19 12 19C18.3636 19 22 12 22 12C22 12 18.3636 5 12 5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                )}
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>
          {emailForm.formState.errors.password && (
            <p className="text-xs text-red-600 mt-2 ml-4">
              {t(emailForm.formState.errors.password.message)}
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
          {loading ? t("logging_in") : t("proceed")}
        </Button>

        <div className="text-center">
          <Link
            href="/auth/forgot-password"
            className="text-blue-600 font-semibold text-sm underline"
          >
            {t("forgot_password")}
          </Link>
        </div>

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



