"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import AddressSelection from "./components/AddressSelection";
import PaymentMethod from "./components/PaymentMethod";
import { generateServiceUrl } from "@/lib/generateServiceUrl";
import { checkoutService } from "@/lib/checkoutService";
import { api } from "@/lib/axios/api";
import { useTranslations } from "next-intl";
import { useToast } from "@/providers/ToastProvider";
import { clearCart } from "@/store/cart";

const formatPrice = (value) =>
  value != null ? Number(value).toFixed(2) : "0.00";

export default function CheckoutPage() {
  const t = useTranslations("");

  const checkoutSchema = yup.object().shape({
    address_id: yup
      .number()
      .required(t("please_select_a_shipping_address"))
      .positive(t("please_select_a_valid_address")),
    payment_method: yup.string().required(t("please_select_a_payment_method")),
  });
  const [addressTypes, setAddressTypes] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [checkoutPreview, setCheckoutPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [useReferralBalance, setUseReferralBalance] = useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch();

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      address_id: null,
      payment_method: "",
    },
  });

  const watchedAddressId = watch("address_id");
  const watchedPaymentMethod = watch("payment_method");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const services = [
          { key: "address_type", limit: 100 },
          { key: "country_and_city", limit: 100 },
        ];
        const res = await api.get(generateServiceUrl(services));
        const data = res.data.data;
        setAddressTypes(data.address_type || []);
        const countryAndCity = data.country_and_city || [];
        const firstCountry = countryAndCity[0];
        setCities(firstCountry?.cities || []);
      } catch (error) {
        console.error("Error fetching services:", error);
        setAddressTypes([]);
        setCities([]);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (!selectedAddressId) {
      setCheckoutPreview(null);
      setPreviewLoading(false);
      return;
    }

    const fetchPreview = async () => {
      setPreviewLoading(true);
      const result = await checkoutService.getCheckoutPreview(selectedAddressId);
      if (result.success) {
        setCheckoutPreview(result.data);
      }
      setPreviewLoading(false);
    };

    fetchPreview();
  }, [selectedAddressId]);

  useEffect(() => {
    if (selectedAddressId !== watchedAddressId) {
      setValue("address_id", selectedAddressId);
    }
  }, [selectedAddressId, watchedAddressId, setValue]);

  useEffect(() => {
    if (selectedPaymentMethod !== watchedPaymentMethod) {
      setValue("payment_method", selectedPaymentMethod);
    }
  }, [selectedPaymentMethod, watchedPaymentMethod, setValue]);

  const handleAddressSelect = (addressId) => setSelectedAddressId(addressId);
  const handlePaymentMethodSelect = (method) => setSelectedPaymentMethod(method);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await checkoutService.submitOrder({
        payment_method: data.payment_method,
        address_id: data.address_id,
        ...(data.note ? { note: data.note } : {}),
        ...(useReferralBalance ? { use_referral_balance: true } : {}),
      });

      if (result.success) {
        const responseData = result.data;
        if (responseData?.redirect && responseData?.redirect_url) {
          dispatch(clearCart());
          window.location.href = responseData.redirect_url;
        } else {
          const orderData = responseData?.data ?? responseData;
          setCompletedOrder(orderData);
          setOrderSuccess(true);
          dispatch(clearCart());
        }
      } else {
        toast({
          title: t("error"),
          description: result.error,
          variant: "error",
        });
      }
    } catch (error) {
      toast({
        title: t("error"),
        description: error.message,
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              {t("order_successful")}
            </h2>
            <p className="text-gray-600 mb-4">{t("order_successful_body")}</p>

            {completedOrder && (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-700 space-y-1">
                {completedOrder.grand_total != null && (
                  <p className="text-lg font-semibold text-gray-900">
                    {t("total")}: {formatPrice(completedOrder.grand_total)} ₼
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {completedOrder?.order_uuid && (
                <Link
                  href={`/account/orders/${completedOrder.order_uuid}`}
                  className="inline-block border border-green-primary text-green-primary px-8 py-3 rounded-full hover:bg-green-primary/10 transition-colors"
                >
                  {t("view_order")}
                </Link>
              )}
              <Link
                href="/"
                className="inline-block bg-green-primary text-white px-8 py-3 rounded-full hover:bg-green-primary/90 transition-colors"
              >
                {t("continue_shopping")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="flex flex-col gap-10 py-10">
        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-center lg:text-left">
          {t("checkout")}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-2 lg:gap-10 pb-10">
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 lg:gap-10">
              {/* Address Selection */}
              <div>
                <AddressSelection
                  addressTypes={addressTypes}
                  cities={cities}
                  selectedAddressId={selectedAddressId}
                  onAddressSelect={handleAddressSelect}
                />
                {errors.address_id && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.address_id.message}
                  </p>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <PaymentMethod
                  selectedPaymentMethod={selectedPaymentMethod}
                  onPaymentMethodSelect={handlePaymentMethodSelect}
                />
                {errors.payment_method && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.payment_method.message}
                  </p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="col-span-12 lg:col-span-4 border border-gray-200 rounded-lg px-2 py-3 lg:px-10 lg:py-8 h-fit">
              <h3 className="text-lg font-semibold mb-4">{t("order_summary")}</h3>

              {previewLoading ? (
                <div className="space-y-3 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : checkoutPreview ? (
                <div className="flex flex-col gap-4">
                  {/* Sellers breakdown */}
                  {checkoutPreview.sellers?.map((seller) => (
                    <div key={seller.company_id} className="flex flex-col gap-2">
                      <p className="text-sm font-semibold text-gray-700">
                        {seller.store_code}
                      </p>

                      {seller.weight_warning && (
                        <div className="flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1.5">
                          <span>⚠️</span>
                          <span>{t("weight_warning_message")}</span>
                        </div>
                      )}

                      {seller.is_sedan && (
                        <div className="flex items-start gap-1.5 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded px-2 py-1.5">
                          <span>🚗</span>
                          <span>{t("sedan_required_message")}</span>
                        </div>
                      )}

                      {seller.items?.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-start text-sm">
                          <span className="flex-1 text-gray-600">
                            {item.title}{" "}
                            <span className="text-gray-400">x{item.quantity}</span>
                          </span>
                          <span className="font-medium shrink-0">
                            {formatPrice(item.price)} ₼
                          </span>
                        </div>
                      ))}

                      <div className="flex gap-2 items-center text-sm">
                        <span className="flex-1 text-gray-500">{t("shipping")}</span>
                        <div className="flex-1 border-b border-dashed border-gray-300"></div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-gray-600">
                            {seller.shipping === 0
                              ? t("free")
                              : `${formatPrice(seller.shipping)} ₼`}
                          </span>
                          {seller.shipping_is_estimate && (
                            <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-1">
                              ~
                            </span>
                          )}
                        </div>
                      </div>

                      {seller.shipping_eta_minutes != null && (
                        <div className="flex gap-2 items-center text-xs text-gray-500">
                          <span>🕐</span>
                          <span>
                            ~{seller.shipping_eta_minutes} {t("minutes")}
                          </span>
                        </div>
                      )}

                      <div className="border-b border-gray-100"></div>
                    </div>
                  ))}

                  {/* Referral perks banner */}
                  {checkoutPreview.referral && (
                    checkoutPreview.referral.free_delivery_applied ||
                    checkoutPreview.referral.discount_applied
                  ) && (
                    <div className="flex flex-col gap-1.5 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
                      {checkoutPreview.referral.free_delivery_applied && (
                        <span>🚚 {t("free_delivery_applied") || "Pulsuz çatdırılma tətbiq edildi"}</span>
                      )}
                      {checkoutPreview.referral.discount_applied && (
                        <span>
                          🏷️ {t("referral_discount_applied") || "Referral endirimi"}: −{formatPrice(checkoutPreview.referral.discount_amount)} ₼
                        </span>
                      )}
                    </div>
                  )}

                  {/* Totals */}
                  <div className="flex flex-col gap-3 mt-1">
                    <div className="flex gap-2 items-center">
                      <span className="text-base">{t("amount")}</span>
                      <div className="flex-1 border-b border-gray-500 border-dashed"></div>
                      <span className="text-base font-medium text-gray-primary">
                        {formatPrice(
                          checkoutPreview.referral?.subtotal_after_discount ??
                          checkoutPreview.subtotal
                        )} ₼
                      </span>
                    </div>

                    <div className="flex gap-2 items-center">
                      <span className="text-base">{t("shipping")}</span>
                      <div className="flex-1 border-b border-gray-500 border-dashed"></div>
                      <span className="text-base font-medium text-gray-primary">
                        {(checkoutPreview.referral?.shipping_after_perk ?? checkoutPreview.total_shipping) === 0
                          ? t("free")
                          : `${formatPrice(checkoutPreview.referral?.shipping_after_perk ?? checkoutPreview.total_shipping)} ₼`}
                      </span>
                    </div>

                    <div className="flex gap-2 items-center">
                      <span className="text-base font-bold">{t("total")}</span>
                      <div className="flex-1 border-b border-gray-500 border-dashed"></div>
                      <span className="text-base font-bold text-green-primary">
                        {formatPrice(
                          checkoutPreview.referral?.grand_total_after_perks ??
                          checkoutPreview.grand_total
                        )} ₼
                      </span>
                    </div>
                  </div>

                  {/* Use referral balance toggle */}
                  {checkoutPreview.referral?.can_use_balance && (
                    <label className="flex items-start gap-3 cursor-pointer p-3 bg-[#EEF5FD] rounded-lg border border-blue-200 mt-1">
                      <input
                        type="checkbox"
                        checked={useReferralBalance}
                        onChange={(e) => setUseReferralBalance(e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-[#3696E7] shrink-0"
                      />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-[#00569C]">
                          {t("use_referral_balance") || "Bonus balansı ilə ödə"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {t("available_balance") || "Mövcud"}: {formatPrice(checkoutPreview.referral.available_balance)} ₼
                        </span>
                      </div>
                    </label>
                  )}
                </div>
              ) : (
                <div className="text-sm text-gray-500 text-center py-4">
                  {t("no_items_in_cart")}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={
                  isSubmitting || !selectedAddressId || !selectedPaymentMethod
                }
                className="w-full h-12 lg:h-14 text-white rounded-full mt-6 font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? t("processing") : t("place_order")}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
