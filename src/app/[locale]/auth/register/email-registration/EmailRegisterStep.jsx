"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { emailRegisterSchema } from "../validation-schemas";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function EmailRegisterStep({ onSubmit, loading, error }) {
  const t = useTranslations();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerForm = useForm({
    resolver: yupResolver(emailRegisterSchema),
    defaultValues: {
      name: "",
      surname: "",
      phone: "994",
      password: "",
      password_confirmation: "",
      gender: "male",
      birth_date: "",
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
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700 font-medium">
              +994
            </span>
            <input
              type="text"
              placeholder={t("phone_number")}
              value={
                registerForm.watch("phone")
                  ? registerForm.watch("phone").substring(3)
                  : ""
              }
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                const fullPhone = "994" + value;
                registerForm.setValue("phone", fullPhone, {
                  shouldValidate: true,
                });
              }}
              className="w-full pl-20 pr-6 py-4 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              maxLength={9}
            />
          </div>
          {registerForm.formState.errors.phone && (
            <p className="text-xs text-red-600 mt-2 ml-4">
              {t(registerForm.formState.errors.phone.message)}
            </p>
          )}
        </div>

        <div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t("password")}
              {...registerForm.register("password")}
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
          {registerForm.formState.errors.password && (
            <p className="text-xs text-red-600 mt-2 ml-4">
              {t(registerForm.formState.errors.password.message)}
            </p>
          )}
        </div>

        <div>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("confirm_password")}
              {...registerForm.register("password_confirmation")}
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
          {registerForm.formState.errors.password_confirmation && (
            <p className="text-xs text-red-600 mt-2 ml-4">
              {t(registerForm.formState.errors.password_confirmation.message)}
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
          {loading ? t("registering") : t("continue")}
        </Button>
      </form>
    </div>
  );
}
