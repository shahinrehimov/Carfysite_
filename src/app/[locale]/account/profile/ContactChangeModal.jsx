"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Phone, X } from "lucide-react";
import { api } from "@/lib/axios/api";
import { formatAzPhoneForDisplay } from "@/lib/utils";

const RESEND_COOLDOWN = 60;

function OtpInput({ otp, onChange, inputRefs }) {
  const handleChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    onChange(next);
    if (val && idx < 3) inputRefs[idx + 1]?.current?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs[idx - 1]?.current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);
    if (!digits) return;
    const next = ["", "", "", ""];
    for (let i = 0; i < digits.length; i++) next[i] = digits[i];
    onChange(next);
    const focusIdx = Math.min(digits.length, 3);
    inputRefs[focusIdx]?.current?.focus();
  };

  return (
    <div className="flex gap-3 justify-center">
      {otp.map((digit, idx) => (
        <input
          key={idx}
          ref={inputRefs[idx]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center text-lg font-medium rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00569C] focus:border-transparent"
        />
      ))}
    </div>
  );
}

function getOtpExpiresIn(response) {
  const data = response?.data;
  return data?.data?.otp_expires_in ?? data?.otp_expires_in ?? 180;
}

function shouldReturnToInputStep(message) {
  if (!message) return false;
  return /maksimum|maximum|yeni kod|vaxtı bitib|tapılmadı|expired|not found/i.test(
    message
  );
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function ContactChangeModal({ type, open, onClose, onSuccess }) {
  const t = useTranslations();
  const isEmail = type === "email";

  const [step, setStep] = useState("input");
  const [value, setValue] = useState("");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [error, setError] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const [otpTimer, setOtpTimer] = useState(0);
  const [otpExpired, setOtpExpired] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const otpIntervalRef = useRef(null);
  const resendIntervalRef = useRef(null);

  const inputClass =
    "w-full rounded-full border border-gray-200 bg-white min-h-[52px] px-5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00569C] focus:border-transparent transition-all";

  const clearTimers = useCallback(() => {
    clearInterval(otpIntervalRef.current);
    clearInterval(resendIntervalRef.current);
    otpIntervalRef.current = null;
    resendIntervalRef.current = null;
  }, []);

  const resetState = useCallback(() => {
    clearTimers();
    setStep("input");
    setValue("");
    setPhoneDigits("");
    setError("");
    setOtpMessage("");
    setLoading(false);
    setOtp(["", "", "", ""]);
    setOtpTimer(0);
    setOtpExpired(false);
    setResendTimer(0);
  }, [clearTimers]);

  const startOtpExpiryTimer = useCallback(
    (seconds) => {
      clearInterval(otpIntervalRef.current);
      setOtpTimer(seconds);
      setOtpExpired(false);
      otpIntervalRef.current = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(otpIntervalRef.current);
            setOtpExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    []
  );

  const startResendCooldown = useCallback(() => {
    clearInterval(resendIntervalRef.current);
    setResendTimer(RESEND_COOLDOWN);
    resendIntervalRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(resendIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open, resetState]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const getPayloadValue = () => {
    if (isEmail) return value.trim();
    return "994" + phoneDigits.replace(/\D/g, "");
  };

  const validateInput = () => {
    if (isEmail) {
      const email = value.trim();
      if (!email) {
        setError(t("email_required"));
        return null;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError(t("email_invalid"));
        return null;
      }
      return email;
    }

    const digits = phoneDigits.replace(/\D/g, "");
    if (digits.length !== 9) {
      setError(t("phone_format_error"));
      return null;
    }
    return "994" + digits;
  };

  const handleSendOtp = async () => {
    setError("");
    const payloadValue = validateInput();
    if (!payloadValue) return;

    setLoading(true);
    try {
      const endpoint = isEmail
        ? "/profile/change-email/send-otp"
        : "/profile/change-phone/send-otp";
      const body = isEmail ? { email: payloadValue } : { phone: payloadValue };
      const res = await api.post(endpoint, body);

      setValue(payloadValue);
      if (!isEmail) {
        setPhoneDigits(payloadValue.slice(3));
      }

      const msg =
        res.data?.data?.message ?? res.data?.message ?? t("otp_sent_message");
      setOtpMessage(msg);
      setStep("otp");
      setOtp(["", "", "", ""]);
      startOtpExpiryTimer(getOtpExpiresIn(res));
      startResendCooldown();
      setTimeout(() => otpRefs[0]?.current?.focus(), 100);
    } catch (err) {
      const msg = err.response?.data?.message;
      const fieldError = isEmail
        ? err.response?.data?.errors?.email?.[0]
        : err.response?.data?.errors?.phone?.[0];
      setError(fieldError ?? msg ?? t("send_otp_failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 4) {
      setError(t("enter_otp"));
      return;
    }

    if (otpExpired) {
      setError(t("time_expired"));
      return;
    }

    setError("");
    setLoading(true);
    try {
      const endpoint = isEmail
        ? "/profile/change-email/verify"
        : "/profile/change-phone/verify";
      const body = isEmail
        ? { email: value, otp: Number(code) }
        : { phone: value, otp: Number(code) };
      const res = await api.post(endpoint, body);

      const updatedUser = res.data?.user;
      const successMessage = res.data?.message;
      if (updatedUser) {
        onSuccess(updatedUser, successMessage);
      }
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message ?? t("otp_error");
      if (shouldReturnToInputStep(msg)) {
        setStep("input");
        setOtp(["", "", "", ""]);
        clearTimers();
        setOtpExpired(false);
        setOtpTimer(0);
        setResendTimer(0);
      } else {
        setOtp(["", "", "", ""]);
        setTimeout(() => otpRefs[0]?.current?.focus(), 100);
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    setError("");
    setLoading(true);
    try {
      const endpoint = isEmail
        ? "/profile/change-email/send-otp"
        : "/profile/change-phone/send-otp";
      const body = isEmail ? { email: value } : { phone: value };
      const res = await api.post(endpoint, body);

      const msg =
        res.data?.data?.message ?? res.data?.message ?? t("otp_resent");
      setOtpMessage(msg);
      setOtp(["", "", "", ""]);
      startOtpExpiryTimer(getOtpExpiresIn(res));
      startResendCooldown();
      setTimeout(() => otpRefs[0]?.current?.focus(), 100);
    } catch (err) {
      setError(err.response?.data?.message ?? t("otp_resend_error"));
    } finally {
      setLoading(false);
    }
  };

  const handleBackToInput = () => {
    setStep("input");
    setOtp(["", "", "", ""]);
    setError("");
    clearTimers();
    setOtpExpired(false);
    setOtpTimer(0);
    setResendTimer(0);
    if (!isEmail) {
      setPhoneDigits(value.startsWith("994") ? value.slice(3) : phoneDigits);
    }
  };

  const displayContactValue = () => {
    if (isEmail) return value;
    return formatAzPhoneForDisplay(value);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => !loading && onClose()}
      />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <button
          type="button"
          onClick={() => !loading && onClose()}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label={t("close")}
        >
          <X size={20} />
        </button>

        <h2 className="text-base font-semibold text-gray-900 mb-1 pr-8">
          {isEmail ? t("change_email") : t("change_phone")}
        </h2>

        {step === "input" ? (
          <div className="mt-4">
            <label className="block text-xs text-gray-500 mb-1.5 pl-1">
              {isEmail ? t("email") : t("phone")}
            </label>

            {isEmail ? (
              <input
                type="email"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError("");
                }}
                className={inputClass}
                placeholder={t("email")}
                autoComplete="email"
              />
            ) : (
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[#00569C] pointer-events-none">
                  <Phone size={15} />
                  <span className="text-sm font-medium">+994</span>
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phoneDigits}
                  onChange={(e) => {
                    setPhoneDigits(e.target.value.replace(/\D/g, "").slice(0, 9));
                    setError("");
                  }}
                  className={`${inputClass} pl-[90px]`}
                  placeholder={t("mobile_number")}
                  maxLength={9}
                />
              </div>
            )}

            {error && (
              <p className="text-xs text-red-600 mt-2 pl-1">{error}</p>
            )}

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="mt-6 w-full min-h-[52px] rounded-full bg-[#00569C] text-white font-medium text-sm hover:bg-[#004580] active:bg-[#003d72] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? t("sending") : t("proceed")}
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2 leading-relaxed">
              {otpMessage || t("otp_sent_message")}
            </p>
            <p className="text-sm text-gray-900 font-medium mb-1">
              {displayContactValue()}
            </p>
            <button
              type="button"
              onClick={handleBackToInput}
              className="text-sm text-[#00569C] font-medium hover:underline mb-4"
            >
              {t("change")}
            </button>

            <OtpInput otp={otp} onChange={setOtp} inputRefs={otpRefs} />

            {error && (
              <p className="text-xs text-red-600 mt-3 text-center">{error}</p>
            )}

            <div className="mt-3 flex items-center justify-center gap-2">
              {otpExpired ? (
                <span className="text-sm font-medium text-red-500">
                  {t("time_expired")}
                </span>
              ) : (
                <span className="text-sm text-gray-500">
                  {formatTime(otpTimer)}
                </span>
              )}
            </div>

            <div className="mt-2 text-sm text-gray-500 text-center">
              {t("no_code")}{" "}
              {resendTimer > 0 ? (
                <span className="text-gray-400">
                  {formatTime(resendTimer)}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="text-[#00569C] font-medium hover:underline disabled:opacity-50"
                >
                  {t("resend")}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleVerify}
              disabled={loading || otpExpired}
              className="mt-6 w-full min-h-[52px] rounded-full bg-[#00569C] text-white font-medium text-sm hover:bg-[#004580] active:bg-[#003d72] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? t("verifying") : t("verify")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
