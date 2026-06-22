"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { forgotPasswordSchema } from "./validation-schemas";

export function ForgotPasswordStep({ onSubmit, loading, error }) {
  const t = useTranslations();

  const form = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-4">
        {t("forgot_password")}
      </h2>
      <p className="text-center text-gray-600 text-sm mb-8">
        {t("forgot_password_description") ||
          "Elektron poçt ünvanınızı daxil edin, şifrə bərpa linki göndərək."}
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <input
            type="email"
            placeholder={t("email")}
            {...form.register("email")}
            className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          />
          {form.formState.errors.email && (
            <p className="text-xs text-red-600 mt-2 ml-4">
              {t(form.formState.errors.email.message)}
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

        <p className="text-center text-gray-600 text-sm">
          <Link href="/auth/login" className="text-blue-600 font-semibold">
            {t("back_to_login") || t("login")}
          </Link>
        </p>
      </form>
    </div>
  );
}
