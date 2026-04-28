"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Clock } from "lucide-react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { api } from "@/lib/axios/api";
import { useTranslations } from "next-intl";

const PAGE_LIMIT = 15;

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

const formatPrice = (value) =>
  value != null ? `${Number(value).toFixed(2)} ₼` : "";

const OrdersList = () => {
  const t = useTranslations();
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [orderDetails, setOrderDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState({});
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
  });

  const fetchOrders = async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await api.get(
        `/orders/load?limit=${PAGE_LIMIT}&page=${page}`
      );
      const { data, meta } = response.data;

      if (append) {
        setOrders((prev) => [...prev, ...data]);
      } else {
        setOrders(data);
      }

      setPagination({
        current_page: meta.current_page,
        total: meta.total,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    if (orderDetails[orderId]) return;

    try {
      setLoadingDetails((prev) => ({ ...prev, [orderId]: true }));
      const response = await api.get(`/orders/show/${orderId}`);
      setOrderDetails((prev) => ({
        ...prev,
        [orderId]: response.data.data,
      }));
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoadingDetails((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const hasMore = pagination.current_page * PAGE_LIMIT < pagination.total;

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      fetchOrders(pagination.current_page + 1, true);
    }
  };

  const toggleOrderExpansion = async (orderId) => {
    const isExpanding = !expandedOrders[orderId];

    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: isExpanding,
    }));

    if (isExpanding) {
      await fetchOrderDetails(orderId);
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-4 py-1 rounded-full text-sm font-medium border";
    switch (status) {
      case "processing":
        return `${base} text-blue-600 border-blue-300 bg-blue-50`;
      case "courier_assigned":
        return `${base} text-purple-600 border-purple-300 bg-purple-50`;
      case "delivered":
        return `${base} text-green-700 border-green-400 bg-green-100`;
      case "failed":
        return `${base} text-red-600 border-red-300 bg-red-50`;
      case "canceled":
      case "cancelled":
        return `${base} text-red-500 border-red-300 bg-red-50`;
      case "payment_pending":
        return `${base} text-amber-600 border-amber-300 bg-amber-50`;
      default:
        return `${base} text-gray-600 border-gray-300 bg-gray-50`;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-lg overflow-hidden animate-pulse"
          >
            <div className="p-4 lg:p-6 bg-white">
              <div className="flex flex-row lg:items-center justify-between gap-4">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="h-6 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-28"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded-full w-20"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-10 bg-gray-200 rounded w-20"></div>
                  <div className="h-11 w-11 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => {
        const detail = orderDetails[order.id];
        return (
          <div
            key={order.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="p-4 lg:p-6 bg-white">
              <div className="flex flex-row lg:items-center justify-between gap-4">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-gray-900">
                      {order.date}
                    </span>
                    <span className="text-sm text-gray-500 font-mono">
                      {order.code}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {order.products_count} {t("products")}
                    </span>
                  </div>

                  <div className="lg:ml-8">
                    <span className={getStatusBadge(order.status)}>
                      {order.status_label}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="flex items-center justify-center px-6 h-[44px] bg-[#3696E7] text-white rounded-full font-medium"
                  >
                    {t("details")}
                  </Link>
                  <button
                    onClick={() => toggleOrderExpansion(order.id)}
                    className="flex items-center justify-center w-[44px] h-[44px] bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 transition-colors cursor-pointer focus:outline-none"
                    disabled={loadingDetails[order.id]}
                  >
                    {loadingDetails[order.id] ? (
                      <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : expandedOrders[order.id] ? (
                      <ChevronUp className="w-6 h-6" />
                    ) : (
                      <ChevronDown className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {expandedOrders[order.id] && (
              <div className="w-full">
                <div className="p-4 lg:p-6">
                  {loadingDetails[order.id] ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : detail ? (
                    <>
                      <h3 className="text-lg font-semibold mb-4">
                        {t("order_items")}
                      </h3>

                      {/* Summary row */}
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">
                              {t("order_code")}:
                            </span>
                            <p className="font-medium">{detail.code}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">{t("date")}:</span>
                            <p className="font-medium">{detail.date}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">{t("items")}:</span>
                            <p className="font-medium">
                              {detail.products_count} {t("products")}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">{t("total")}:</span>
                            <p className="font-medium">
                              {formatPrice(detail.amount_final)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        {detail.items?.map((item, index) => (
                          <div
                            key={item.product?.uuid || index}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100"
                          >
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                              <Image
                                src={
                                  item.product?.hover_image ||
                                  item.product?.product?.hover_image
                                }
                                alt={item.product?.title || ""}
                                width={48}
                                height={48}
                                className="object-contain w-full h-full"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 text-sm truncate">
                                {item.product?.title}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-gray-500">
                                  x{item.quantity}
                                </span>
                                {item.product?.seller?.label && (
                                  <span className="text-xs text-gray-400">
                                    · {item.product.seller.label}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <p className="font-semibold text-sm">
                                {formatPrice(item.amount_final)}
                              </p>
                              {item.product?.has_discount && (
                                <p className="text-xs text-gray-400 line-through">
                                  {formatPrice(item.amount)}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                        <span className="text-xl font-bold">
                          {t("total")}: {formatPrice(detail.amount_final)}
                        </span>
                      </div>

                      {detail.delivery_tracking &&
                        detail.delivery_tracking.length > 0 && (
                          <div className="mt-6 pt-4 border-t border-gray-200">
                            <h4 className="text-base font-semibold mb-3">
                              {t("delivery_tracking")}
                            </h4>
                            <div className="flex flex-col gap-4">
                              {detail.delivery_tracking.map(
                                (sellerTracking, si) => (
                                  <div key={si} className="flex flex-col gap-2">
                                    <p className="text-sm font-medium text-gray-600">
                                      {sellerTracking.store_code}
                                    </p>
                                    {sellerTracking.deliveries?.map(
                                      (delivery, di) => (
                                        <div
                                          key={di}
                                          className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                                        >
                                          <div className="flex flex-col gap-1">
                                            <span
                                              className={`self-start px-2 py-0.5 rounded-full text-xs font-medium ${getDeliveryStatusClass(delivery.status)}`}
                                            >
                                              {delivery.status}
                                            </span>
                                            {delivery.dropoff_eta && (
                                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Clock className="w-3 h-3" />
                                                <span>
                                                  {t("eta")}:{" "}
                                                  {formatEta(
                                                    delivery.dropoff_eta
                                                  )}
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                          {delivery.tracking_url && (
                                            <a
                                              href={delivery.tracking_url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-full hover:bg-blue-700 transition-colors shrink-0"
                                            >
                                              {t("track_order")}
                                              <ExternalLink className="w-3 h-3" />
                                            </a>
                                          )}
                                        </div>
                                      )
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      {t("no_order_details_available")}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-6 py-3 bg-green-primary-dark text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loadingMore ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {t("loading")}
              </>
            ) : (
              t("load_more_orders")
            )}
          </button>
        </div>
      )}

      {orders.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">{t("no_orders_found")}</p>
        </div>
      )}
    </div>
  );
};

export default OrdersList;
