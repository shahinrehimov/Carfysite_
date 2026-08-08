"use client";

import { useState } from "react";
import { api } from "@/lib/axios";
import { useTranslations } from "next-intl";
import { ForgotPasswordStep } from "./ForgotPasswordStep";
import { SuccessStep } from "./SuccessStep";

export default function ForgotPasswordPage() {
  const t = useTranslations();
  const [step, setStep] = useState("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (data) => {
    setError("");
    setLoading(true);

    try {
      await api.post("/forgot-password", {
        email: data.email,
      });

      setEmail(data.email);
      setStep("success");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          t("forgot_password_failed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-0 flex items-center justify-center p-4 py-10 lg:min-h-[70vh] bg-gray-50">
      <div className="w-full max-w-2xl min-h-[600px] bg-[#E8F1FC] rounded-[80px] shadow-[0px_1px_8px_0px_#00000029] overflow-hidden flex flex-col">
        <div className="py-5 text-center font-semibold text-[#4A7FBF] rounded-t-[80px]">
          {t("forgot_password")}
        </div>

        <div className="flex-1 bg-white w-full flex items-center justify-center">
          <div className="p-8 md:p-12 w-full">
            {step === "form" ? (
              <ForgotPasswordStep
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
              />
            ) : (
              <SuccessStep email={email} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
