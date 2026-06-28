"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Copy,
  Check,
  ChevronDown,
  Award,
  Gift,
  ArrowDownLeft,
  Loader2,
  Pencil,
  X,
  Wallet,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { api } from "@/lib/axios/api";
import { Button } from "@/components/ui/button";
import { AccountListLoading } from "@/components/account/account-loading";

const PAGE_LIMIT = 15;

const formatPrice = (value) =>
  value != null ? `${Number(value).toFixed(2)} ₼` : "0.00 ₼";

const formatDate = (isoString) => {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  } catch {
    return isoString;
  }
};

const TIER_STYLES = {
  bronze: {
    badge: "text-amber-700 bg-amber-50 border-amber-300",
    labelKey: "tier_bronze",
  },
  silver: {
    badge: "text-gray-600 bg-gray-100 border-gray-300",
    labelKey: "tier_silver",
  },
  gold: {
    badge: "text-yellow-700 bg-yellow-50 border-yellow-400",
    labelKey: "tier_gold",
  },
  platinum: {
    badge: "text-purple-700 bg-purple-50 border-purple-300",
    labelKey: "tier_platinum",
  },
};

const EARNING_STATUS_STYLES = {
  available: "text-green-700 bg-green-100",
  pending: "text-amber-700 bg-amber-100",
  refunded: "text-red-600 bg-red-100",
  cancelled: "text-red-600 bg-red-100",
  fraud_hold: "text-orange-700 bg-orange-100",
};

export default function ReferralsPanel() {
  const t = useTranslations();

  const [referralData, setReferralData] = useState(null);
  const [balance, setBalance] = useState(null);
  const [earnings, setEarnings] = useState([]);
  const [earningsMeta, setEarningsMeta] = useState({
    current_page: 1,
    total: 0,
  });
  const [perks, setPerks] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const [editingCode, setEditingCode] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [savingCode, setSavingCode] = useState(false);

  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawCard, setWithdrawCard] = useState("");
  const [withdrawCardHolder, setWithdrawCardHolder] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [submittingWithdrawal, setSubmittingWithdrawal] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [myRes, balanceRes, earningsRes, perksRes] = await Promise.all([
        api.get("/referral/my"),
        api.get("/referral/balance"),
        api.get(`/referral/earnings?limit=${PAGE_LIMIT}&page=1`),
        api.get("/referral/perks"),
      ]);
      setReferralData(myRes.data.data);
      setBalance(balanceRes.data.data);
      setEarnings(earningsRes.data.data || []);
      setEarningsMeta(earningsRes.data.meta || { current_page: 1, total: 0 });
      setPerks(perksRes.data.data);
    } catch (err) {
      console.error("Referral data fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const loadMoreEarnings = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const nextPage = earningsMeta.current_page + 1;
      const res = await api.get(
        `/referral/earnings?limit=${PAGE_LIMIT}&page=${nextPage}`
      );
      setEarnings((prev) => [...prev, ...(res.data.data || [])]);
      setEarningsMeta(res.data.meta || earningsMeta);
    } catch (err) {
      console.error("Load more earnings error:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "code") {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } else {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch {}
  };

  const handleSaveCode = async () => {
    if (!newCode?.trim()) return;
    setSavingCode(true);
    setCodeError("");
    try {
      const res = await api.post("/referral/update-code", {
        code: newCode.trim(),
      });
      const updatedCode = res.data.data.code;
      setReferralData((prev) => ({
        ...prev,
        code: updatedCode,
        link: prev.link.replace(prev.code, updatedCode),
      }));
      setEditingCode(false);
      setNewCode("");
    } catch (err) {
      setCodeError(
        err.response?.data?.message || t("error_occurred")
      );
    } finally {
      setSavingCode(false);
    }
  };

  const handleWithdrawal = async () => {
    setWithdrawError("");
    setSubmittingWithdrawal(true);
    try {
      await api.post("/referral/withdrawals", {
        amount: Number(withdrawAmount),
        card_last4: withdrawCard,
        card_holder_name: withdrawCardHolder,
      });
      setShowWithdrawal(false);
      setWithdrawAmount("");
      setWithdrawCard("");
      setWithdrawCardHolder("");
      fetchAll();
    } catch (err) {
      setWithdrawError(
        err.response?.data?.message || t("error_occurred")
      );
    } finally {
      setSubmittingWithdrawal(false);
    }
  };

  const hasMoreEarnings =
    earningsMeta.current_page * PAGE_LIMIT < earningsMeta.total;
  const tierStyle = TIER_STYLES[referralData?.tier] || TIER_STYLES.bronze;
  const availableBalance =
    balance?.available_balance ?? referralData?.available_balance ?? 0;

  if (loading) {
    return <AccountListLoading count={5} showTitle />;
  }

  return (
    <div className="flex flex-col gap-6 py-6">
      {/* Page title */}
      <h1 className="text-2xl font-semibold text-gray-900">
        {t("referrals_bonuses")}
      </h1>

      {/* Referral Code Card */}
      {referralData && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
            {/* Left: tier + code + link */}
            <div className="flex flex-col gap-3 flex-1 min-w-0">
              {/* Tier + active status */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${tierStyle.badge}`}
                >
                  <Award className="w-3.5 h-3.5" />
                  {t(tierStyle.labelKey)} · {referralData.rate}
                </span>
                {!referralData.is_active && (
                  <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-600 border border-red-300">
                    {t("inactive")}
                  </span>
                )}
              </div>

              {/* Referral code row */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-500 shrink-0">
                  {t("your_referral_code")}:
                </span>
                {editingCode ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      value={newCode}
                      onChange={(e) =>
                        setNewCode(
                          e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")
                        )
                      }
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-mono w-32 focus:outline-none focus:border-[#3696E7]"
                      placeholder={referralData.code}
                      maxLength={20}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveCode}
                      disabled={savingCode || !newCode?.trim()}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 bg-[#3696E7] text-white rounded-lg hover:bg-[#2a7acc] disabled:opacity-50 transition-colors"
                    >
                      {savingCode ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        t("save")
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setEditingCode(false);
                        setCodeError("");
                        setNewCode("");
                      }}
                      className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    {codeError && (
                      <span className="text-xs text-red-500 w-full">
                        {codeError}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#3696E7] text-lg tracking-widest">
                      {referralData.code}
                    </span>
                    <button
                      onClick={() => copyToClipboard(referralData.code, "code")}
                      className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                      title={t("copy")}
                    >
                      {copiedCode ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setEditingCode(true);
                        setNewCode(referralData.code);
                      }}
                      className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                      title={t("change")}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Referral link row */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 shrink-0">
                  {t("referral_link")}:
                </span>
                <span className="text-sm text-gray-600 truncate max-w-xs">
                  {referralData.link}
                </span>
                <button
                  onClick={() => copyToClipboard(referralData.link, "link")}
                  className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                  title={t("copy")}
                >
                  {copiedLink ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Right: stats */}
            <div className="flex gap-6 lg:gap-8 shrink-0">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {referralData.total_referrals}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {t("total_referrals")}
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {referralData.active_referrals}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {t("active")}
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-500">
                  {referralData.pending_referrals}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {t("pending")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inactive warning */}
      {referralData && !referralData.is_active && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700">
            ⚠️{" "}
            {t("referral_inactive_warning")}
          </p>
        </div>
      )}

      {/* Perks Banner */}
      {perks?.has_perks && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Gift className="w-5 h-5 text-[#3696E7] shrink-0 mt-0.5" />
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {perks.free_delivery_remaining > 0 && (
              <span className="text-sm text-blue-800">
                🚚{" "}
                {t("free_delivery_remaining")}
                : <strong>{perks.free_delivery_remaining}</strong>
              </span>
            )}
            {perks.discount_orders_remaining > 0 && (
              <span className="text-sm text-blue-800">
                🏷️{" "}
                {t("discount_orders_remaining")}
                :{" "}
                <strong>
                  {perks.discount_orders_remaining} × {perks.discount_rate}
                </strong>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main 2-col: earnings list + balance card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Earnings list */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {earnings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
                <Wallet className="w-12 h-12 text-gray-300" />
                <p className="text-sm font-medium">
                  {t("no_earnings_yet")}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {earnings.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 px-5 py-4"
                  >
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-md bg-[#EEF5FD] flex items-center justify-center shrink-0">
                      <ArrowDownLeft className="w-5 h-5 text-[#3696E7]" />
                    </div>

                    {/* Description + date */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 leading-snug">
                        {t("referral_earning_label")}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDate(item.delivered_at || item.credited_at)}
                      </p>
                    </div>

                    {/* Status badge (hidden on xs) */}
                    <span
                      className={`hidden sm:inline-flex text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                        EARNING_STATUS_STYLES[item.status] ||
                        "text-gray-600 bg-gray-100"
                      }`}
                    >
                      {t(item.status) || item.status}
                    </span>

                    {/* Amounts */}
                    <div className="text-right shrink-0 ml-2">
                      <p className="text-sm font-semibold text-gray-900">
                        +{Number(item.amount).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatPrice(item.order_amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load more */}
            {hasMoreEarnings && (
              <div className="flex justify-center p-4 border-t border-gray-100">
                <button
                  onClick={loadMoreEarnings}
                  disabled={loadingMore}
                  className="flex items-center gap-2 text-sm text-[#3696E7] font-medium hover:underline disabled:opacity-50"
                >
                  {loadingMore ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                  {t("load_more")}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Balance card + actions */}
        <div className="flex flex-col gap-3">
          {/* Blue gradient balance card */}
          <div
            className="relative rounded-xl overflow-hidden p-6 text-white"
            style={{
              background: "linear-gradient(135deg, #3696E7 0%, #00569C 100%)",
            }}
          >
            <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute right-2 bottom-2 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-3">
              {t("bonuses")}
            </p>
            <p className="text-4xl font-bold tracking-tight leading-none">
              {Number(availableBalance).toFixed(2).replace(".", ",")}
            </p>
            <p className="text-sm text-white/60 mt-1">₼</p>
          </div>

          {/* Balance details */}
          {balance && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                {t("balance_details")}
              </p>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">
                    {t("pending_balance")}
                  </span>
                  <span className="font-medium text-amber-600">
                    {formatPrice(balance.pending_balance)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">
                    {t("available_balance")}
                  </span>
                  <span className="font-medium text-green-600">
                    {formatPrice(balance.available_balance)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-gray-500">
                    {t("lifetime_earned")}
                  </span>
                  <span className="font-medium">
                    {formatPrice(balance.lifetime_earned)}
                  </span>
                </div>
              </div>

              {/* Withdraw button */}
              <button
                onClick={() => setShowWithdrawal((v) => !v)}
                disabled={balance.available_balance < 50}
                className="mt-4 w-full py-2.5 text-sm font-medium text-[#3696E7] border border-[#3696E7] rounded-lg hover:bg-[#3696E7] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t("withdraw")}
              </button>
              {balance.available_balance < 50 && (
                <p className="text-xs text-gray-400 text-center mt-1.5">
                  {t("minimum_withdrawal_50")}
                </p>
              )}

              {/* Withdrawal form */}
              {showWithdrawal && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder={t("withdrawal_amount_placeholder")}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#3696E7]"
                    min={50}
                    max={balance.available_balance}
                  />
                  <input
                    type="text"
                    value={withdrawCard}
                    onChange={(e) =>
                      setWithdrawCard(
                        e.target.value.replace(/\D/g, "").slice(0, 4)
                      )
                    }
                    placeholder={t("card_last4")}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#3696E7]"
                    maxLength={4}
                  />
                  <input
                    type="text"
                    value={withdrawCardHolder}
                    onChange={(e) =>
                      setWithdrawCardHolder(e.target.value.toUpperCase())
                    }
                    placeholder={t("card_holder_name")}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#3696E7]"
                  />
                  {withdrawError && (
                    <p className="text-xs text-red-500">{withdrawError}</p>
                  )}
                  <button
                    onClick={handleWithdrawal}
                    disabled={
                      submittingWithdrawal ||
                      !withdrawAmount ||
                      !withdrawCard ||
                      !withdrawCardHolder
                    }
                    className="w-full py-2.5 bg-[#3696E7] text-white text-sm font-medium rounded-lg hover:bg-[#2a7acc] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                  >
                    {submittingWithdrawal ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      t("send_withdrawal_request")
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
