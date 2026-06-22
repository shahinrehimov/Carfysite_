"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { resetPasswordSchema } from "./validation-schemas";

export function ResetPasswordStep({ onSubmit, loading, error, email }) {
  const t = useTranslations();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: { password: "", password_confirmation: "" },
  });

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-4">
        {t("reset_password") || "Yeni şifrə"}
      </h2>
      <p className="text-center text-gray-600 text-sm mb-8">
        {t("reset_password_description") ||
          "Hesabınız üçün yeni şifrə təyin edin."}
        {email && (
          <>
            <br />
            <span className="text-[#4A7FBF] font-semibold">{email}</span>
          </>
        )}
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t("password")}
              {...form.register("password")}
              className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="text-xs text-red-600 mt-2 ml-4">
              {t(form.formState.errors.password.message)}
            </p>
          )}
        </div>

        <div>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("confirm_password")}
              {...form.register("password_confirmation")}
              className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all pr-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {form.formState.errors.password_confirmation && (
            <p className="text-xs text-red-600 mt-2 ml-4">
              {t(form.formState.errors.password_confirmation.message)}
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
          {loading ? t("saving") || t("processing") : t("proceed")}
        </Button>

        <p className="text-center text-gray-600 text-sm">
          <Link href="/auth/login" className="text-blue-600 font-semibold">
            {t("back_to_login") || t("login")}
          </Link>
        </p>
      </form>
    </div>
  );
}
