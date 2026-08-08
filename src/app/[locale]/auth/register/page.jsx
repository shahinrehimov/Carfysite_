"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/axios";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { initiateAppleLogin, initiateGoogleLogin } from "@/lib/authService";

// Phone registration components
import { PhoneStep } from "./phone-registration/PhoneStep";
import { PhoneOtpStep } from "./phone-registration/PhoneOtpStep";
import { PhoneRegisterStep } from "./phone-registration/PhoneRegisterStep";

// Email registration components
import { EmailCheckStep } from "./email-registration/EmailCheckStep";
import { EmailRegisterStep } from "./email-registration/EmailRegisterStep";
import { EmailVerifyStep } from "./email-registration/EmailVerifyStep";

export default function RegisterPage() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref");

  // Steps: phone, otp, register, success for phone flow
  // Steps: email-check, email-register, email-verify, success for email flow
  const [step, setStep] = useState("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Store data between steps
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [phoneConfirmationToken, setPhoneConfirmationToken] = useState("");
  const [userUuid, setUserUuid] = useState("");

  // OTP timer
  const [timer, setTimer] = useState(300); // 5 minutes = 300 seconds
  const [canResend, setCanResend] = useState(false);

  // Active tab (for UI toggle)
  const [activeTab, setActiveTab] = useState("phone"); // phone or email

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setStep(tab === "phone" ? "phone" : "email-check");
    setError("");
    setPhone("");
    setEmail("");
    setOtp("");
    setPhoneConfirmationToken("");
    setUserUuid("");
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

  // ========== PHONE REGISTRATION HANDLERS ==========
  const handlePhoneSubmit = async (data) => {
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/register/with-phone/send-otp", {
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
      const response = await api.post("/register/with-phone/check-otp", {
        phone: phone,
        otp: parseInt(data.otp),
      });

      if (response.data.step === "register_with_phone") {
        setPhoneConfirmationToken(response.data.phone_confirmation_token);
        setOtp(data.otp);
        setStep("phone-register");
      }
    } catch (err) {
      setError(err.response?.data?.message || t("invalid_otp"));
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneRegisterSubmit = async (data) => {
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/register/with-phone/submit", {
        device_type: "web",
        name: data.name,
        surname: data.surname,
        gender: null,
        birth_date: null,
        email: data.email,
        phone: phone,
        phone_confirmation_token: phoneConfirmationToken,
        otp: parseInt(otp),
        ...(data.ref_code?.trim() ? { ref_code: data.ref_code.trim() } : {}),
      });

      if (response.data.step === "login") {
        router.push("/auth/register/success");
      }
    } catch (err) {
      setError(err.response?.data?.message || t("registration_failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setLoading(true);

    try {
      await api.post("/register/with-phone/send-otp", {
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

  // ========== EMAIL REGISTRATION HANDLERS ==========
  const handleEmailCheckSubmit = async (data) => {
    setError("");
    setLoading(true);

    try {
      const response = await api.get(
        `/register/with-email/check-email?email=${data.email}`
      );

      if (response.data.step === "register_with_email") {
        setEmail(data.email);
        setStep("email-register");
      }
    } catch (err) {
      setError(err.response?.data?.message || t("email_check_failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailRegisterSubmit = async (data) => {
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/register/with-email/submit", {
        device_type: "web",
        name: data.name,
        surname: data.surname,
        gender: data.gender || null,
        birth_date: data.birth_date || null,
        email: email,
        phone: data.phone,
        password: data.password,
        password_confirmation: data.password_confirmation,
        ...(data.ref_code?.trim() ? { ref_code: data.ref_code.trim() } : {}),
      });

      if (response.data.step === "otp_email") {
        setUserUuid(response.data.user.uuid);
        setStep("email-verify");
      }
    } catch (err) {
      setError(err.response?.data?.message || t("registration_failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailVerifySubmit = async (data) => {
    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        `/register/with-email/verify-otp/${userUuid}`,
        {
          email: email,
          otp: parseInt(data.otp),
        }
      );

      if (response.data.message === "Email verified successfully") {
        router.push("/auth/register/success");
      }
    } catch (err) {
      setError(err.response?.data?.message || t("invalid_otp"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-0 flex items-center justify-center p-4 py-10 lg:min-h-[70vh] bg-gray-50">
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
            {t("register_with_phone")}
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
            {t("register_with_email")}
          </button>
        </div>

        <div className="flex-1 bg-white w-full flex items-center justify-center">
          <div className="p-8 md:p-12  w-full">
            {/* Phone Registration Flow */}
            {step === "phone" && activeTab === "phone" && (
              <PhoneStep
                onSubmit={handlePhoneSubmit}
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

            {step === "phone-register" && activeTab === "phone" && (
              <PhoneRegisterStep
                onSubmit={handlePhoneRegisterSubmit}
                loading={loading}
                error={error}
                defaultRefCode={refCode}
              />
            )}

            {/* Email Registration Flow */}
            {step === "email-check" && activeTab === "email" && (
              <EmailCheckStep
                onSubmit={handleEmailCheckSubmit}
                onAppleSignIn={handleAppleSignIn}
                onGoogleSignIn={handleGoogleSignIn}
                loading={loading}
                error={error}
              />
            )}

            {step === "email-register" && activeTab === "email" && (
              <EmailRegisterStep
                onSubmit={handleEmailRegisterSubmit}
                loading={loading}
                error={error}
                defaultRefCode={refCode}
              />
            )}

            {step === "email-verify" && activeTab === "email" && (
              <EmailVerifyStep
                email={email}
                onSubmit={handleEmailVerifySubmit}
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
