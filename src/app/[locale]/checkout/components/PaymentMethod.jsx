"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Banknote, Check, CreditCard } from "lucide-react";
import { checkoutService } from "@/lib/checkoutService";
import { useTranslations } from "next-intl";
export default function PaymentMethod({
  selectedPaymentMethod,
  onPaymentMethodSelect,
  className = "",
}) {
  const t = useTranslations("");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load payment methods on component mount
  useEffect(() => {
    loadPaymentMethods();
  }, []);

  // Auto-select first payment method if none is selected
  useEffect(() => {
    if (paymentMethods.length > 0 && !selectedPaymentMethod) {
      const firstMethod = paymentMethods[0];
      if (firstMethod && onPaymentMethodSelect) {
        onPaymentMethodSelect(firstMethod.value);
      }
    }
  }, [paymentMethods, selectedPaymentMethod, onPaymentMethodSelect]);

  const loadPaymentMethods = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await checkoutService.getPaymentMethods();
      if (result.success) {
        setPaymentMethods(result.data.data || []);
      } else {
        setError(result.error || "Failed to load payment methods");
        console.error("Failed to load payment methods:", result.error);
      }
    } catch (error) {
      setError("An error occurred while loading payment methods");
      console.error("Error loading payment methods:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentMethodSelect = (paymentMethodValue) => {
    if (onPaymentMethodSelect) {
      onPaymentMethodSelect(paymentMethodValue);
    }
  };

  const renderPaymentIcon = (paymentMethod) => {
    // Default icon based on payment method value
    switch (paymentMethod.value) {
      case "cash":
        return (
          <div className="w-6 h-6 bg-[#3696E73D] rounded flex items-center justify-center">
            <span className="text-[#00569C]">
              <Banknote className="w-4 h-4" />
            </span>
          </div>
        );
      case "bank2":
      case "card":
      case "credit_card":
        return (
          <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
            <span className="text-blue-600">
              <CreditCard className="w-4 h-4" />
            </span>
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-500">
              <Banknote className="w-4 h-4" />
            </span>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div
        className={cn(
          "w-full border border-gray-200 rounded-lg p-4 lg:p-6",
          className
        )}
      >
        <div className="w-full mb-6">
          <h2 className="text-xl lg:text-2xl font-bold">
            {t("payment_method")}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {t("choose_your_payment_method")}
          </p>
        </div>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "w-full border border-gray-200 rounded-lg p-4 lg:p-6",
          className
        )}
      >
        <div className="w-full mb-6">
          <h2 className="text-xl lg:text-2xl font-bold">
            {t("payment_method")}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {t("choose_your_payment_method")}
          </p>
        </div>
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={loadPaymentMethods} className="text-sm font-medium">
            {t("try_again")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full border border-gray-200 rounded-lg p-4 lg:p-6",
        className
      )}
    >
      <div className="w-full mb-6">
        <h2 className="text-xl lg:text-2xl font-bold">{t("payment_method")}</h2>
        <p className="text-gray-600 text-sm mt-1">
          {t("choose_your_payment_method")}
        </p>
      </div>

      {/* Payment Methods List */}
      <div className="space-y-3">
        {paymentMethods.map((paymentMethod) => (
          <div
            key={paymentMethod.value}
            className={cn(
              "border rounded-lg p-4 cursor-pointer transition-all",
              selectedPaymentMethod === paymentMethod.value
                ? "border-green-primary bg-[#3696E73D]"
                : "border-gray-200 hover:border-gray-300"
            )}
            onClick={() => handlePaymentMethodSelect(paymentMethod.value)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Payment Method Icon */}
                {renderPaymentIcon(paymentMethod)}

                {/* Payment Method Label */}
                <div>
                  <h3 className="font-medium text-gray-900">
                    {paymentMethod.label}
                  </h3>
                  {paymentMethod.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {paymentMethod.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Radio Button */}
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                  selectedPaymentMethod === paymentMethod.value
                    ? " border-[#00569C] bg-[#00569C] text-white"
                    : "border-gray-300"
                )}
              >
                {selectedPaymentMethod === paymentMethod.value && (
                  <Check className="w-3 h-3" />
                )}
              </div>
            </div>

            {/* Required Fields (if any) */}
            {paymentMethod.required_fields &&
              paymentMethod.required_fields.length > 0 &&
              selectedPaymentMethod === paymentMethod.value && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">
                    {t("additional_information_required")}
                  </p>
                  <div className="space-y-2">
                    {paymentMethod.required_fields.map((field, index) => (
                      <div key={index} className="text-sm">
                        <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                        {field}
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {paymentMethods.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">
            {t("no_payment_methods_available")}
          </p>
          <p className="text-sm text-gray-400">
            {t("please_contact_support_for_assistance")}
          </p>
        </div>
      )}
    </div>
  );
}
