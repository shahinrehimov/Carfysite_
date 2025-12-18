"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { phoneRegisterSchema } from "../validation-schemas";

export function PhoneRegisterStep({ onSubmit, loading, error }) {
  const t = useTranslations();

  const registerForm = useForm({
    resolver: yupResolver(phoneRegisterSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
    },
  });

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-8">{t("register")}</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={registerForm.handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div>
          <input
            type="text"
            placeholder={t("name")}
            {...registerForm.register("name")}
            className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          />
          {registerForm.formState.errors.name && (
            <p className="text-xs text-red-600 mt-2 ml-4">
              {t(registerForm.formState.errors.name.message)}
            </p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder={t("surname")}
            {...registerForm.register("surname")}
            className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          />
          {registerForm.formState.errors.surname && (
            <p className="text-xs text-red-600 mt-2 ml-4">
              {t(registerForm.formState.errors.surname.message)}
            </p>
          )}
        </div>

        <div>
          <input
            type="email"
            placeholder={t("email")}
            {...registerForm.register("email")}
            className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          />
          {registerForm.formState.errors.email && (
            <p className="text-xs text-red-600 mt-2 ml-4">
              {t(registerForm.formState.errors.email.message)}
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
          {loading ? t("registering") : t("next")}
        </Button>
      </form>
    </div>
  );
}
