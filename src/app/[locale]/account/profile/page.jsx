"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Lock, Phone, Eye, EyeOff, Camera, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios/api";
import { getCookie, setCookie } from "@/lib/axios/utils";
import { logout } from "@/lib/auth";
import { DatePicker } from "@/components/ui/date-picker";
import { ContactChangeModal } from "./ContactChangeModal";

const OTP_RESEND_COOLDOWN = 60;

function getUserImage(user) {
  return user?.image ?? user?.photo ?? null;
}

function extractUserFromResponse(data) {
  if (!data) return null;
  if (data.user) return data.user;
  if (data.data && typeof data.data === "object" && !Array.isArray(data.data)) {
    if (data.data.uuid || data.data.email || data.data.phone) return data.data;
  }
  return null;
}

function formatBirthDateForInput(value) {
  if (!value) return "";
  const str = String(value);
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str.slice(0, 10);
  const match = str.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (match) return `${match[3]}-${match[2]}-${match[1]}`;
  return "";
}

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
    <div className="flex gap-3">
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

export default function ProfilePage() {
  const t = useTranslations();

  const [user, setUser] = useState(() => {
    try {
      const raw = getCookie("user_data");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [name, setName] = useState(user?.name ?? "");
  const [surname, setSurname] = useState(user?.surname ?? "");
  const [birthDate, setBirthDate] = useState(() =>
    formatBirthDateForInput(user?.birth_date)
  );

  const email = user?.email ?? "";
  const phone = (() => {
    const raw = user?.phone ?? "";
    return raw.startsWith("994") ? raw.slice(3) : raw;
  })();

  const canChangeEmail = !["google", "apple"].includes(user?.register_type);

  const [contactModal, setContactModal] = useState(null);

  const [avatarPreview, setAvatarPreview] = useState(
    getUserImage(user) ?? null
  );
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [showOtpSection, setShowOtpSection] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const [otpTimer, setOtpTimer] = useState(0);
  const [otpExpired, setOtpExpired] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const timerRef = useRef(null);
  const resendTimerRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const router = useRouter();

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const clearPasswordTimers = useCallback(() => {
    clearInterval(timerRef.current);
    clearInterval(resendTimerRef.current);
    timerRef.current = null;
    resendTimerRef.current = null;
  }, []);

  const startOtpTimer = useCallback((seconds = 180) => {
    setOtpTimer(seconds);
    setOtpExpired(false);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setOtpExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const startResendCooldown = useCallback(() => {
    setResendTimer(OTP_RESEND_COOLDOWN);
    clearInterval(resendTimerRef.current);
    resendTimerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(resendTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => () => clearPasswordTimers(), [clearPasswordTimers]);

  const updateUserState = useCallback((updatedUser) => {
    setUser(updatedUser);
    setCookie("user_data", JSON.stringify(updatedUser));
    setAvatarPreview(getUserImage(updatedUser));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("authChange"));
    }
  }, []);

  const handleContactChangeSuccess = useCallback(
    (updatedUser, message) => {
      updateUserState(updatedUser);
      showToast(message ?? t("saved_success"));
    },
    [updateUserState, showToast, t]
  );

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast(t("avatar_size_error"), "error");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    setAvatarLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.upload("/profile/image", formData);
      const updatedUser = extractUserFromResponse(res.data);
      if (updatedUser) {
        updateUserState(updatedUser);
      } else if (res.data?.image || res.data?.photo) {
        updateUserState({
          ...user,
          image: res.data.image ?? res.data.photo,
          photo: res.data.photo ?? res.data.image,
        });
      }
      showToast(res.data?.message ?? t("saved_success"));
    } catch (err) {
      setAvatarPreview(getUserImage(user));
      showToast(err.response?.data?.message ?? t("save_error"), "error");
    } finally {
      URL.revokeObjectURL(previewUrl);
      setAvatarLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAvatarDelete = async () => {
    setAvatarLoading(true);
    try {
      const res = await api.delete("/profile/image");
      const updatedUser = extractUserFromResponse(res.data);
      if (updatedUser) {
        updateUserState(updatedUser);
      } else {
        updateUserState({ ...user, image: null, photo: null });
      }
      showToast(res.data?.message ?? t("saved_success"));
    } catch (err) {
      showToast(err.response?.data?.message ?? t("delete_error"), "error");
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const payload = {
        name,
        surname,
        gender: user?.gender ?? null,
        birth_date: birthDate || null,
      };
      const res = await api.post("/profile/update", payload);
      const updated = res.data?.data ?? res.data;
      if (updated) {
        updateUserState({
          ...user,
          name: updated.name ?? name,
          surname: updated.surname ?? surname,
          birth_date: updated.birth_date ?? (birthDate || null),
        });
        setBirthDate(formatBirthDateForInput(updated.birth_date ?? birthDate));
      }
      showToast(t("saved_success"));
    } catch (err) {
      showToast(err.response?.data?.message ?? t("save_error"), "error");
    }
  };

  const handleChangePassword = async () => {
    if (!password || !passwordConfirmation) {
      showToast(t("fill_password_fields"), "error");
      return;
    }
    if (password !== passwordConfirmation) {
      showToast(t("passwords_mismatch"), "error");
      return;
    }
    try {
      const res = await api.post("/profile/change-password", {
        password,
        password_confirmation: passwordConfirmation,
      });
      const expiresIn =
        res.data?.data?.otp_expires_in ?? res.data?.otp_expires_in ?? 180;
      setShowOtpSection(true);
      setOtp(["", "", "", ""]);
      startOtpTimer(expiresIn);
      startResendCooldown();
      setTimeout(() => otpRefs[0]?.current?.focus(), 100);
    } catch (err) {
      showToast(
        err.response?.data?.message ?? t("password_change_error"),
        "error"
      );
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length < 4) {
      showToast(t("enter_otp"), "error");
      return;
    }
    try {
      await api.post("/profile/change-password/verify-otp", {
        otp: Number(code),
        password,
        password_confirmation: passwordConfirmation,
      });
      showToast(t("password_changed"));
      setShowOtpSection(false);
      setShowPasswordSection(false);
      setPassword("");
      setPasswordConfirmation("");
      setOtp(["", "", "", ""]);
      clearPasswordTimers();
    } catch (err) {
      showToast(err.response?.data?.message ?? t("otp_error"), "error");
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    try {
      const res = await api.post("/profile/change-password", {
        password,
        password_confirmation: passwordConfirmation,
      });
      const expiresIn =
        res.data?.data?.otp_expires_in ?? res.data?.otp_expires_in ?? 180;
      setOtp(["", "", "", ""]);
      startOtpTimer(expiresIn);
      startResendCooldown();
      setTimeout(() => otpRefs[0]?.current?.focus(), 100);
      showToast(t("otp_resent"));
    } catch (err) {
      showToast(err.response?.data?.message ?? t("otp_resend_error"), "error");
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await api.delete("/profile/delete-account");
      logout();
      router.replace("/");
    } catch (err) {
      setShowDeleteModal(false);
      showToast(err.response?.data?.message ?? t("delete_error"), "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (showOtpSection) {
        await handleVerifyOtp();
      } else if (showPasswordSection && password) {
        await handleChangePassword();
      } else {
        await handleUpdateProfile();
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const inputClass =
    "w-full rounded-full border border-gray-200 bg-white min-h-[52px] px-5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00569C] focus:border-transparent transition-all";

  return (
    <div className="max-w-2xl">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
            toast.type === "error"
              ? "bg-red-50 border border-red-200 text-red-700"
              : "bg-green-50 border border-green-200 text-green-700"
          }`}
        >
          {toast.message}
        </div>
      )}

      <h1 className="text-xl font-semibold text-gray-900 mb-6">{t("title")}</h1>

      {/* Avatar */}
      <div className="flex flex-col items-start mb-8">
        <div className="relative mb-3">
          <div
            className={`w-20 h-20 rounded-full overflow-hidden bg-gray-100 border border-gray-200 ${
              avatarLoading ? "opacity-60" : ""
            }`}
          >
            {avatarPreview ? (
              <Image
                src={avatarPreview}
                alt="Avatar"
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Camera size={28} />
              </div>
            )}
          </div>
          {avatarLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#00569C] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
          disabled={avatarLoading}
        />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={avatarLoading}
            className="text-sm border border-[#00569C] text-[#00569C] rounded-full px-5 py-1.5 hover:bg-[#00569C]/5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {t("choose_file")}
          </button>
          {avatarPreview && (
            <button
              type="button"
              onClick={handleAvatarDelete}
              disabled={avatarLoading}
              className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Trash2 size={15} />
              {t("delete")}
            </button>
          )}
        </div>
      </div>

      {/* Name / Surname */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 pl-1">
            {t("name")}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder={t("name")}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 pl-1">
            {t("surname")}
          </label>
          <input
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            className={inputClass}
            placeholder={t("surname")}
          />
        </div>
      </div>

      {/* Birth Date */}
      <div className="mb-4">
        <label className="block text-xs text-gray-500 mb-1.5 pl-1">
          {t("birth_date")}
        </label>
        <DatePicker
          value={birthDate}
          onChange={setBirthDate}
          placeholder={t("birth_date")}
          maxDate={new Date().toISOString().slice(0, 10)}
        />
      </div>

      {/* Email / Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 pl-1">
            {t("email")}
          </label>
          <input
            type="email"
            value={email}
            readOnly
            className={`${inputClass} bg-gray-50 cursor-default`}
          />
          {canChangeEmail && (
            <button
              type="button"
              onClick={() => setContactModal("email")}
              className="mt-2 text-sm font-medium text-[#00569C] hover:text-[#004580] transition-colors pl-1"
            >
              {t("change_email")}
            </button>
          )}
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 pl-1">
            {t("phone")}
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[#00569C] pointer-events-none">
              <Phone size={15} />
              <span className="text-sm font-medium">+994</span>
            </div>
            <input
              type="tel"
              value={phone}
              readOnly
              className={`${inputClass} pl-[90px] bg-gray-50 cursor-default`}
            />
          </div>
          <button
            type="button"
            onClick={() => setContactModal("phone")}
            className="mt-2 text-sm font-medium text-[#00569C] hover:text-[#004580] transition-colors pl-1"
          >
            {t("change_phone")}
          </button>
        </div>
      </div>

      {/* Change Password Toggle */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => {
            if (showOtpSection) return;
            setShowPasswordSection((v) => !v);
            if (showPasswordSection) {
              setPassword("");
              setPasswordConfirmation("");
            }
          }}
          className="flex items-center gap-2 text-sm font-medium text-[#00569C] hover:text-[#004580] transition-colors"
        >
          <Lock size={16} />
          {t("change_password")}
        </button>

        {/* Password Fields */}
        {showPasswordSection && (
          <div className="mt-4 space-y-3">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("new_password")}
                className={`${inputClass} pr-12`}
                disabled={showOtpSection}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPasswordConfirm ? "text" : "password"}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder={t("confirm_password")}
                className={`${inputClass} pr-12`}
                disabled={showOtpSection}
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswordConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>

            {/* OTP Section */}
            {showOtpSection && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {t("otp_sent_message")}
                </p>
                <OtpInput otp={otp} onChange={setOtp} inputRefs={otpRefs} />
                <div className="mt-3 flex items-center gap-2">
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
                <div className="mt-2 text-sm text-gray-500">
                  {t("no_code")}{" "}
                  {resendTimer > 0 ? (
                    <span className="text-gray-400">
                      {formatTime(resendTimer)}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-[#00569C] font-medium hover:underline"
                    >
                      {t("resend")}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="w-full sm:w-[280px] min-h-[52px] rounded-full bg-[#00569C] text-white font-medium text-sm hover:bg-[#004580] active:bg-[#003d72] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? t("saving") : t("save")}
        </button>
      </div>

      {/* Delete Account */}
      <button
        type="button"
        onClick={() => setShowDeleteModal(true)}
        className="text-sm text-orange-500 underline underline-offset-2 hover:text-orange-600 transition-colors"
      >
        {t("delete_account")}
      </button>

      <ContactChangeModal
        type={contactModal}
        open={contactModal !== null}
        onClose={() => setContactModal(null)}
        onSuccess={handleContactChangeSuccess}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !deleteLoading && setShowDeleteModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              {t("delete_confirm_title")}
            </h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              {t("delete_confirm_body")}
            </p>
            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
                className="flex-1 min-h-[44px] rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="flex-1 min-h-[44px] rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {deleteLoading ? t("deleting") : t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
