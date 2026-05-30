"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { paymentService } from "@/lib/paymentService";
import { useTranslations } from "next-intl";
import { CheckIcon, AlertTriangleIcon, AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export default function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const t = useTranslations("");

  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);
  const [missingParams, setMissingParams] = useState([]);

  useEffect(() => {
    const order = searchParams.get("order");
    const method = searchParams.get("method");
    const token = searchParams.get("token");

    const checkPaymentStatus = async () => {
      try {
        const missing = [];
        if (!order) missing.push("order");
        if (!method) missing.push("method");
        if (!token) missing.push("token");

        if (missing.length > 0) {
          setMissingParams(missing);
          setLoading(false);
          return;
        }

        const response = await paymentService.checkPaymentStatus(
          order,
          method,
          token
        );

        if (response.status === 200) {
          setPaymentStatus(response.data.status);
        }
      } catch (err) {
        if (err.response?.status === 400) {
          setError(err.response.data.message || t("payment_invalid_information"));
        } else {
          setError(t("payment_status_check_failed"));
        }
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      checkPaymentStatus();
    }, 5000);
    return () => clearTimeout(timer);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-16 mb-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00569C] mx-auto"></div>
          <p className="text-gray-600 text-base mt-4">
            {t("payment_status_checking")}
          </p>
        </div>
      </div>
    );
  }

  if (missingParams.length > 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-16 mb-16">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircleIcon className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t("payment_invalid_url")}
            </h1>
            <p className="text-gray-600 mb-4">
              {t("payment_missing_parameters")}
              {missingParams.join(", ")}
            </p>
            <p className="text-sm text-gray-500">
              {t("payment_contact_support")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-16 mb-16">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircleIcon className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t("payment_error_title")}
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button
              variant="primary"
              className="h-11 px-8 rounded-full font-semibold"
              onClick={() => window.location.reload()}
            >
              {t("payment_retry")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === "paid") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-16 mb-16">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <CheckIcon className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t("payment_success_title")}
            </h1>
            <p className="text-gray-600 mb-6">{t("payment_success_message")}</p>
            <div className="flex flex-col gap-3">
              <Button
                variant="primary"
                size="lg"
                className="w-full rounded-full font-semibold"
                asChild
              >
                <Link href="/account/orders">
                  {t("payment_view_orders")}
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-full font-semibold"
                asChild
              >
                <Link href="/">
                  {t("payment_continue_shopping")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-16 mb-16">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertTriangleIcon className="w-8 h-8 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t("payment_pending_title")}
          </h1>
          <p className="text-gray-600 mb-2">
            {t("payment_status_label")}
            <span className="font-semibold ml-1 capitalize">
              {paymentStatus}
            </span>
          </p>
          <p className="text-gray-500 text-sm mb-6">
            {t("payment_pending_message")}
          </p>
          <Button
            variant="primary"
            className="h-11 px-8 rounded-full font-semibold"
            onClick={() => window.location.reload()}
          >
            {t("payment_refresh")}
          </Button>
        </div>
      </div>
    </div>
  );
}
