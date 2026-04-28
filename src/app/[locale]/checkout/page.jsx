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

const checkoutSchema = yup.object().shape({
  address_id: yup
    .number()
    .required("Please select a shipping address")
    .positive("Please select a valid address"),
  payment_method: yup.string().required("Please select a payment method"),
});

const formatPrice = (value) =>
  value != null ? Number(value).toFixed(2) : "0.00";

export default function CheckoutPage() {
  const t = useTranslations("");
  const [addressTypes, setAddressTypes] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [checkoutPreview, setCheckoutPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(true);
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

    const fetchPreview = async () => {
      setPreviewLoading(true);
      const result = await checkoutService.getCheckoutPreview();
      if (result.success) {
        setCheckoutPreview(result.data);
      }
      setPreviewLoading(false);
    };

    fetchServices();
    fetchPreview();
  }, []);

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
      });

      if (result.success) {
        const orderData = result.data?.data;
        if (orderData?.redirect_url) {
          window.location.href = orderData.redirect_url;
        } else {
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
            <p className="text-gray-600 mb-8">{t("order_successful_body")}</p>
            <Link
              href="/"
              className="inline-block bg-green-primary text-white px-8 py-3 rounded-full hover:bg-green-primary/90 transition-colors"
            >
              {t("continue_shopping")}
            </Link>
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
                        {seller.company_name}
                      </p>
                      {seller.items?.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-start text-sm">
                          <span className="flex-1 text-gray-600">
                            {item.product_title}{" "}
                            <span className="text-gray-400">x{item.quantity}</span>
                          </span>
                          <span className="font-medium shrink-0">
                            {formatPrice(item.subtotal)} ₼
                          </span>
                        </div>
                      ))}
                      <div className="flex gap-2 items-center text-sm">
                        <span className="flex-1 text-gray-500">{t("shipping")}</span>
                        <div className="flex-1 border-b border-dashed border-gray-300"></div>
                        <span className="text-gray-600 shrink-0">
                          {seller.shipping === 0
                            ? t("free")
                            : `${formatPrice(seller.shipping)} ₼`}
                        </span>
                      </div>
                      <div className="border-b border-gray-100"></div>
                    </div>
                  ))}

                  {/* Totals */}
                  <div className="flex flex-col gap-3 mt-1">
                    <div className="flex gap-2 items-center">
                      <span className="text-base">{t("amount")}</span>
                      <div className="flex-1 border-b border-gray-500 border-dashed"></div>
                      <span className="text-base font-medium text-gray-primary">
                        {formatPrice(checkoutPreview.subtotal)} ₼
                      </span>
                    </div>

                    <div className="flex gap-2 items-center">
                      <span className="text-base">{t("shipping")}</span>
                      <div className="flex-1 border-b border-gray-500 border-dashed"></div>
                      <span className="text-base font-medium text-gray-primary">
                        {checkoutPreview.total_shipping === 0
                          ? t("free")
                          : `${formatPrice(checkoutPreview.total_shipping)} ₼`}
                      </span>
                    </div>

                    <div className="flex gap-2 items-center">
                      <span className="text-base font-bold">{t("total")}</span>
                      <div className="flex-1 border-b border-gray-500 border-dashed"></div>
                      <span className="text-base font-bold text-green-primary">
                        {formatPrice(checkoutPreview.grand_total)} ₼
                      </span>
                    </div>
                  </div>
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
