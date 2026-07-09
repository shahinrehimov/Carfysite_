"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/axios";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import {
  initiateAppleLogin,
  initiateGoogleLogin,
  saveAuthSession,
} from "@/lib/authService";
import { getPostLoginRedirect } from "@/lib/authRedirect";

// Phone login components
import { PhoneStep } from "./phone-login/PhoneStep";
import { PhoneOtpStep } from "./phone-login/PhoneOtpStep";

// Email login components
import { EmailStep } from "./email-login/EmailStep";

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const postLoginRedirect = getPostLoginRedirect(searchParams);

  // Steps: phone, otp for phone flow
  // Steps: email for email flow
  const [step, setStep] = useState("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Store data between steps
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // OTP timer
  const [timer, setTimer] = useState(300); // 5 minutes = 300 seconds
  const [canResend, setCanResend] = useState(false);

  // Active tab (for UI toggle)
  const [activeTab, setActiveTab] = useState("phone"); // phone or email

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setStep(tab === "phone" ? "phone" : "email");
    setError("");
    setPhone("");
    setEmail("");
  };

  useEffect(() => {
    if (step === "otp" && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  // ========== PHONE LOGIN HANDLERS ==========
  const handlePhoneSubmit = async (data) => {
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/login/with-phone/send-otp", {
        phone: data.phone,
      });

      if (response.data.step === "otp_phone") {
        setPhone(data.phone);
        setStep("otp");
        setTimer(300);
        setCanResend(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || t("send_otp_failed"));
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneOtpSubmit = async (data) => {
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/login/with-phone/submit", {
        device_type: "web",
        phone: phone,
        otp: parseInt(data.otp),
      });

      if (saveAuthSession(response.data)) {
        router.push(postLoginRedirect);
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || t("invalid_otp"));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setLoading(true);

    try {
      await api.post("/login/with-phone/send-otp", {
        phone: phone,
      });
      setTimer(300);
      setCanResend(false);
    } catch (err) {
      setError(err.response?.data?.message || t("resend_otp_failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleThirdPartySignIn = async (initiateLogin) => {
    setError("");
    setLoading(true);

    try {
      await initiateLogin();
    } catch (err) {
      setError(err.response?.data?.message || t("login_failed"));
      setLoading(false);
    }
  };

  const handleAppleSignIn = () => handleThirdPartySignIn(initiateAppleLogin);
  const handleGoogleSignIn = () => handleThirdPartySignIn(initiateGoogleLogin);

  // ========== EMAIL LOGIN HANDLERS ==========
  const handleEmailSubmit = async (data) => {
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/login/with-email", {
        device_type: "web",
        email: data.email,
        password: data.password,
      });

      if (saveAuthSession(response.data)) {
        router.push(postLoginRedirect);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          t("login_failed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-2xl min-h-[600px] bg-[#E8F1FC] rounded-[80px] shadow-[0px_1px_8px_0px_#00000029] overflow-hidden flex flex-col">
        {/* Tabs */}
        <div className="flex w-full bg-[#E8F1FC] relative ">
          {/* Phone Tab */}
          <button
            onClick={() => handleTabChange("phone")}
            className={`flex-1 py-5 text-center font-semibold transition-all duration-300 ${
              activeTab === "phone"
                ? "bg-white text-[#4A7FBF] rounded-t-[80px]"
                : "text-[#4A7FBF] rounded-tl-3xl rounded-tr-[80px]"
            }`}
          >
            {t("login_with_phone")}
          </button>

          {/* Email Tab */}
          <button
            onClick={() => handleTabChange("email")}
            className={`flex-1 py-5 text-center font-semibold transition-all duration-300 ${
              activeTab === "email"
                ? "bg-white text-[#4A7FBF] rounded-t-[80px]"
                : "bg-[#E8F1FC] text-[#4A7FBF] rounded-tr-[80px]"
            }`}
          >
            {t("login_with_email")}
          </button>
        </div>

        <div className="flex-1 bg-white w-full flex items-center justify-center">
          <div className="p-8 md:p-12  w-full">
            {/* Phone Login Flow */}
            {step === "phone" && activeTab === "phone" && (
              <PhoneStep
                onSubmit={handlePhoneSubmit}
                onAppleSignIn={handleAppleSignIn}
                onGoogleSignIn={handleGoogleSignIn}
                loading={loading}
                error={error}
              />
            )}

            {step === "otp" && activeTab === "phone" && (
              <PhoneOtpStep
                phone={phone}
                onSubmit={handlePhoneOtpSubmit}
                onResend={handleResendOtp}
                loading={loading}
                error={error}
                timer={timer}
                canResend={canResend}
              />
            )}

            {/* Email Login Flow */}
            {step === "email" && activeTab === "email" && (
              <EmailStep
                onSubmit={handleEmailSubmit}
                onAppleSignIn={handleAppleSignIn}
                onGoogleSignIn={handleGoogleSignIn}
                loading={loading}
                error={error}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
