"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { api } from "@/lib/axios/api";

export default function ContactForm() {
  const t = useTranslations();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const response = await api.post("/contact/send", form);
      setSuccess(response.data?.message || t("contact_success"));
      setForm({ full_name: "", email: "", message: "" });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          t("contact_error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        name="full_name"
        value={form.full_name}
        onChange={handleChange}
        placeholder={t("full_name")}
        required
        className="w-full px-5 py-3.5 rounded-full border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
      />
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder={t("email")}
        required
        className="w-full px-5 py-3.5 rounded-full border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
      />
      <textarea
        name="message"
        value={form.message}
        onChange={handleChange}
        placeholder={t("message")}
        required
        rows={6}
        className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition resize-none"
      />

      {error && (
        <p className="text-sm text-red-500 px-1">{error}</p>
      )}
      {success && (
        <p className="text-sm text-green-600 px-1">{success}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? t("sending") : t("send")}
      </button>
    </form>
  );
}
