"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { phoneSchema } from "../validation-schemas";
import { Link } from "@/i18n/routing";

export function PhoneStep({ onSubmit, loading, error }) {
  const t = useTranslations();

  const phoneForm = useForm({
    resolver: yupResolver(phoneSchema),
    defaultValues: { phone: "" },
  });

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-8">{t("register")}</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={phoneForm.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700 font-medium">
              +994
            </span>
            <input
              type="text"
              placeholder={t("phone_number")}
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
          {loading ? t("sending") : t("next")}
        </Button>

        <p className="text-center text-gray-600 text-sm">
          {t("have_account")}{" "}
          <Link href="/auth/login" className="text-blue-600 font-semibold">
            {t("login")}
          </Link>
        </p>
      </form>
    </div>
  );
}
