"use client";
import React, { useState, useEffect } from "react";

import { Copy, Wallet, ExternalLink, Clock } from "lucide-react";
import Image from "next/image";
import { api } from "@/lib/axios/api";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { AccountDetailLoading } from "@/components/account/account-loading";

const getDeliveryStatusClass = (status) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-amber-100 text-amber-800";
    case "rejected":
    case "canceled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatEta = (isoString) => {
  if (!isoString) return null;
  try {
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
};

const getOrderStatusClass = (status) => {
  switch (status) {
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "courier_assigned":
      return "bg-purple-100 text-purple-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "canceled":
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "failed":
      return "bg-red-100 text-red-800";
    case "payment_pending":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatPrice = (value) => {
  if (value == null) return "—";
  return `${Number(value).toFixed(2)} ₼`;
};

const getProductHref = (product) => {
  if (!product?.seller?.store_code) return null;

  const productData = product.product || product;
  const slug = product.slug || productData.slug;
  const categorySlugs = productData.category_slugs;

  if (!slug || !categorySlugs?.sub_category_slug) return null;

  const sellerQuery = `seller=${product.seller.store_code}`;
  const variantQuery = product.variant_slug
    ? `&variant=${product.variant_slug}`
    : "";

  if (categorySlugs.parent_category_slug) {
    return `/${categorySlugs.parent_category_slug}/${categorySlugs.sub_category_slug}/${slug}?${sellerQuery}${variantQuery}`;
  }

  return `/${categorySlugs.sub_category_slug}/${slug}?${sellerQuery}${variantQuery}`;
};

export default function OrderPage({ params }) {
  const unwrappedParams = React.use(params);
  const t = useTranslations();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/orders/details/${unwrappedParams.slug}`
        );
        setOrder(response.data.data);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (unwrappedParams.slug) {
      fetchOrderDetails();
    }
  }, [unwrappedParams.slug]);

  const copyOrderId = () => {
    if (order?.code) {
      navigator.clipboard.writeText(order.code);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="flex flex-col gap-10 py-10">
          <AccountDetailLoading />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container">
        <div className="flex flex-col gap-10 py-10">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-red-500">
              {error || t("order_not_found")}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-10 py-10">
        <div className="grid grid-cols-12 gap-2 lg:gap-10">
          <div className="col-span-12 flex flex-col gap-10">
            {/* Order Header */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">
                  {t("order_id")}: {order.code}
                </h1>
                <button
                  className="p-1 text-gray-500 hover:text-gray-700 cursor-pointer"
                  onClick={copyOrderId}
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <p className="text-gray-600">{order.date}</p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusClass(order.status)}`}
                >
                  {order.status_label}
                </span>
              </div>
            </div>

            {/* Order Details Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-7 gap-8">
              {/* Delivery address */}
              {order.address && (
                <div className="bg-white rounded-lg border p-6 col-span-1 xl:col-span-5 flex items-start gap-4">
                  <Image
                    src="/icons/buyer.svg"
                    alt="order"
                    width={20}
                    height={20}
                    className="mt-1"
                  />
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      {t("delivery_address")}
                    </h3>

                    {order.address.address_type?.title && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          {t("address_type")}
                        </p>
                        <p className="font-medium">
                          {order.address.address_type.title}
                        </p>
                      </div>
                    )}

                    {order.address.city?.title && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          {t("city")}
                        </p>
                        <p className="font-medium">
                          {order.address.city.title}
                        </p>
                      </div>
                    )}

                    {order.address.address_line_1 && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          {t("address")}
                        </p>
                        <p className="font-medium underline cursor-pointer">
                          {order.address.address_line_1}
                          {order.address.address_line_2 &&
                            `, ${order.address.address_line_2}`}
                        </p>
                      </div>
                    )}

                    {order.address.phone && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          {t("phone")}
                        </p>
                        <p className="font-medium">{order.address.phone}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div
                className={`bg-white rounded-lg border p-6 ${order.address ? "col-span-1 xl:col-span-2" : "col-span-1 xl:col-span-7"}`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-medium">{t("order")}</h3>
                  <span className="text-2xl font-semibold">
                    {formatPrice(order.amount_final)}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex gap-4 items-center">
                    <span className="text-base">{t("products")}</span>
                    <div className="flex-1 border-b border-dashed border-gray-primary"></div>
                    <span className="text-base text-gray-primary">
                      {order.products_count}
                    </span>
                  </div>

                  <div className="flex gap-4 items-center">
                    <span className="text-base">{t("subtotal")}</span>
                    <div className="flex-1 border-b border-dashed border-gray-primary"></div>
                    <span className="text-base text-gray-primary">
                      {formatPrice(order.amount)}
                    </span>
                  </div>

                  {order.total_discount > 0 && (
                    <div className="flex gap-4 items-center">
                      <span className="text-base">{t("discount")}</span>
                      <div className="flex-1 border-b border-dashed border-gray-primary"></div>
                      <span className="text-base text-[#87A88F]">
                        -{formatPrice(order.total_discount)}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-4 items-center">
                    <span className="text-base">{t("shipping")}</span>
                    <div className="flex-1 border-b border-dashed border-gray-primary"></div>
                    <span className="text-base text-[#87A88F]">
                      {order.shipping === 0
                        ? t("free")
                        : formatPrice(order.shipping)}
                    </span>
                  </div>

                  <div className="flex gap-4 items-center">
                    <span className="text-base font-bold">{t("total")}</span>
                    <div className="flex-1 border-b border-dashed border-gray-primary"></div>
                    <span className="text-base font-bold text-[#87A88F]">
                      {formatPrice(order.amount_final)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            {order.payment_method && (
              <div className="bg-white rounded-lg border p-6 flex gap-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <Wallet className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">
                      {t("payment_method")}
                    </h3>
                    <span
                      className={`font-medium ${
                        order.payment_method.payment_status === "paid"
                          ? "text-[#87A88F]"
                          : order.payment_method.payment_status === "pending"
                            ? "text-yellow-600"
                            : order.payment_method.payment_status ===
                                "partially_refunded"
                              ? "text-amber-600"
                              : order.payment_method.payment_status ===
                                  "refunded"
                                ? "text-blue-600"
                                : "text-red-600"
                      }`}
                    >
                      {order.payment_method.payment_status_label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        {t("payment_method")}
                      </p>
                      <p className="font-medium">
                        {order.payment_method.label}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        {t("amount")}
                      </p>
                      <p className="font-medium">
                        {formatPrice(order.amount_final)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Order Status History */}
            {order.statuses && order.statuses.length > 0 && (
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {t("order_status_history")}
                </h3>
                <ol className="relative border-l border-gray-200 ml-3 space-y-6">
                  {order.statuses.map((s, idx) => (
                    <li key={idx} className="ml-6">
                      <span
                        className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full ring-4 ring-white ${getOrderStatusClass(s.status)}`}
                      />
                      <p className="font-medium text-gray-900">
                        {s.status_label}
                      </p>
                      <p className="text-sm text-gray-500">{s.date}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Delivery Tracking */}
            {order.delivery_tracking && order.delivery_tracking.length > 0 && (
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {t("delivery_tracking")}
                </h3>
                <div className="flex flex-col gap-6">
                  {order.delivery_tracking.map((sellerTracking, si) => (
                    <div key={si} className="flex flex-col gap-3">
                      <p className="text-sm font-semibold text-gray-700">
                        {sellerTracking.store_code}
                      </p>
                      {sellerTracking.deliveries?.map((delivery, di) => (
                        <div
                          key={di}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex flex-col gap-1.5">
                            <span
                              className={`self-start px-2.5 py-0.5 rounded-full text-xs font-medium ${getDeliveryStatusClass(delivery.status)}`}
                            >
                              {delivery.status}
                            </span>
                            {delivery.dropoff_eta && (
                              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <Clock className="w-3.5 h-3.5" />
                                <span>
                                  {t("eta")}: {formatEta(delivery.dropoff_eta)}
                                </span>
                              </div>
                            )}
                          </div>
                          {delivery.tracking_url && (
                            <a
                              href={delivery.tracking_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors self-start sm:self-center shrink-0"
                            >
                              {t("track_order")}
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-lg border">
              <div className="p-4 lg:p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {t("orders_items")}
                </h3>

                <div className="space-y-4">
                  {order.items?.map((item, index) => {
                    const productHref = getProductHref(item.product);
                    const ItemWrapper = productHref ? Link : "div";
                    const wrapperProps = productHref ? { href: productHref } : {};

                    return (
                    <ItemWrapper
                      key={item.product?.uuid || index}
                      {...wrapperProps}
                      className={`flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-white rounded-lg transition-colors${
                        productHref
                          ? " cursor-pointer hover:bg-gray-50 hover:shadow-sm"
                          : ""
                      }`}
                    >
                      {/* Mobile layout */}
                      <div className="block lg:hidden w-full">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                            <Image
                              src={item.product?.hover_image}
                              alt={item.product?.title || ""}
                              width={48}
                              height={48}
                              className="object-contain w-full h-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">
                              {item.product?.title}
                            </h4>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold">
                                  {formatPrice(item.product?.price_final)}
                                </span>
                                {item.product?.has_discount && (
                                  <>
                                    <span className="text-xs text-gray-500 line-through">
                                      {formatPrice(item.product?.price)}
                                    </span>
                                    <span className="text-xs text-red-primary font-semibold">
                                      -{item.product?.discount}%
                                    </span>
                                  </>
                                )}
                              </div>
                              <span className="text-sm font-medium text-gray-600">
                                x{item.quantity}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Desktop layout */}
                      <div className="hidden lg:flex lg:items-center lg:gap-4 w-full">
                        <div className="text-lg font-semibold text-gray-600 w-8">
                          {index + 1}
                        </div>

                        <div className="w-20 h-20 rounded-lg flex items-center justify-center">
                          <Image
                            src={
                              item.product?.hover_image ||
                              item.product?.product?.hover_image
                            }
                            alt={
                              item.product?.title ||
                              item.product?.product?.title ||
                              ""
                            }
                            width={80}
                            height={80}
                            className="object-contain w-full h-full"
                          />
                        </div>

                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {item.product?.title ||
                              item.product?.product?.title}
                          </h4>
                          {item.product?.product?.brand?.title && (
                            <p className="text-sm text-gray-500">
                              {item.product.product.brand.title}
                            </p>
                          )}
                          {item.product?.seller?.label && (
                            <p className="text-xs text-gray-400">
                              {item.product.seller.label}
                            </p>
                          )}
                        </div>

                        <div className="text-center w-16">
                          <span className="text-lg font-semibold">
                            x{item.quantity}
                          </span>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-semibold">
                                {formatPrice(item.product?.price_final)}
                              </span>
                              {item.product?.has_discount && (
                                <>
                                  <span className="text-sm text-gray-500 line-through">
                                    {formatPrice(item.product?.price)}
                                  </span>
                                  <span className="text-sm text-red-primary font-semibold px-2 py-1 rounded">
                                    -{item.product?.discount}%
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="flex gap-2 items-center">
                              <span className="text-lg font-semibold">
                                {formatPrice(item.amount_final)}
                              </span>
                              {item.amount !== item.amount_final && (
                                <span className="text-sm text-red-600">
                                  -
                                  {formatPrice(item.amount - item.amount_final)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </ItemWrapper>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
