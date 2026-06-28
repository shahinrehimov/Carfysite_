"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getCookie } from "cookies-next";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { emailVerificationBridge } from "@/lib/emailVerificationBridge";
import axiosInstance from "@/lib/axios/index";

const SKIP_FLAG = "_skipEmailVerification";

function maskEmail(email) {
  if (!email) return "";
  const [localPart, domain] = email.split("@");
  if (!domain) return email;
  const visible = Math.min(3, localPart.length);
  return (
    localPart.substring(0, visible) +
    "*".repeat(Math.max(0, localPart.length - visible)) +
    "@" +
    domain
  );
}

export function EmailVerificationProvider({ children }) {
  const t = useTranslations();

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("send"); // "send" | "otp"
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [userUuid, setUserUuid] = useState("");

  // Holds the resolve() of the pending promise created by the bridge
  const resolveRef = useRef(null);

  const openModal = useCallback((resolve) => {
    let parsedUser = null;
    try {
      const raw = getCookie("user_data");
      if (raw) parsedUser = JSON.parse(raw.toString());
    } catch {
      /* ignore */
    }

    setEmail(parsedUser?.email ?? "");
    setUserUuid(parsedUser?.uuid ?? "");
    setStep("send");
    setOtp("");
    setError("");
    setOpen(true);
    resolveRef.current = resolve;
  }, []);

  // Register / unregister with the bridge
  useEffect(() => {
    emailVerificationBridge.trigger = openModal;
    return () => {
      emailVerificationBridge.trigger = null;
    };
  }, [openModal]);

  const settle = useCallback((verified) => {
    setOpen(false);
    if (resolveRef.current) {
      resolveRef.current(verified);
      resolveRef.current = null;
    }
  }, []);

  const handleClose = useCallback(() => settle(false), [settle]);

  const handleSendEmail = async () => {
    setLoading(true);
    setError("");
    try {
      await axiosInstance.post("/send-verification-email", {}, { [SKIP_FLAG]: true });
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || t("email_send_failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      setError(t("invalid_otp_format"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axiosInstance.post(
        `/register/with-email/verify-otp/${userUuid}`,
        { email, otp: parseInt(otp, 10) },
        { [SKIP_FLAG]: true }
      );
      settle(true);
    } catch (err) {
      setError(err.response?.data?.message || t("invalid_otp"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {children}

      <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
        <DialogContent showCloseButton={false} className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              {t("email_verification")}
            </DialogTitle>
            <DialogDescription className="text-center text-sm mt-1">
              {step === "send"
                ? t("email_verification_prompt")
                : `${maskEmail(email)} ${t("email_verification_code_sent")}`}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {step === "send" && (
            <div className="flex flex-col gap-3 mt-2">
              <Button
                onClick={handleSendEmail}
                disabled={loading}
                variant="primary"
                size="lg"
                className="w-full"
              >
                {loading ? t("sending") : t("send_verification_code")}
              </Button>
              <Button
                onClick={handleClose}
                variant="outline"
                size="lg"
                className="w-full"
              >
                {t("cancel")}
              </Button>
            </div>
          )}

          {step === "otp" && (
            <div className="flex flex-col gap-3 mt-2">
              <input
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                placeholder={t("code")}
                className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-center text-2xl tracking-widest"
                maxLength={4}
                autoFocus
              />
              <Button
                onClick={handleVerifyOtp}
                disabled={loading}
                variant="primary"
                size="lg"
                className="w-full"
              >
                {loading ? t("verifying") : t("verify")}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setStep("send");
                  setOtp("");
                  setError("");
                }}
                className="text-sm text-blue-600 hover:underline text-center"
              >
                {t("resend")}
              </button>
              <Button
                onClick={handleClose}
                variant="outline"
                size="lg"
                className="w-full"
              >
                {t("cancel")}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
