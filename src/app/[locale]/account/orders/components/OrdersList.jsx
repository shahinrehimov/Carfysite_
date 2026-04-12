"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { api } from "@/lib/axios/api";
import { useTranslations } from "next-intl";

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
    last_page: 1,
    next: null,
  });

  const fetchOrders = async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await api.get(`/orders/load?page=${page}`);
      const { data, meta, links } = response.data;

      if (append) {
        setOrders((prev) => [...prev, ...data]);
      } else {
        setOrders(data);
      }

      setPagination({
        current_page: meta.current_page,
        last_page: meta.last_page,
        next: links.next,
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

  const handleLoadMore = () => {
    if (pagination.next && !loadingMore) {
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
    const baseClasses = "px-4 py-1 rounded-full text-sm font-medium border";

    switch (status) {
      case "processing":
        return `${baseClasses} text-blue-600 border-blue-300 bg-blue-50`;
      case "confirmed":
        return `${baseClasses} text-green-600 border-green-300 bg-green-50`;
      case "shipped":
        return `${baseClasses} text-purple-600 border-purple-300 bg-purple-50`;
      case "delivered":
        return `${baseClasses} text-green-700 border-green-400 bg-green-100`;
      case "failed":
        return `${baseClasses} text-red-600 border-red-300 bg-red-50`;
      case "pending":
        return `${baseClasses} text-yellow-600 border-yellow-300 bg-yellow-50`;
      case "canceled":
      case "cancelled":
        return `${baseClasses} text-red-500 border-red-300 bg-red-50`;
      case "returned":
        return `${baseClasses} text-orange-600 border-orange-300 bg-orange-50`;
      case "payment_pending":
        return `${baseClasses} text-amber-600 border-amber-300 bg-amber-50`;
      default:
        return `${baseClasses} text-gray-600 border-gray-300 bg-gray-50`;
    }
  };

  const formatPrice = (price) => {
    return `${price} ₾`;
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
      {orders.map((order) => (
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
                  <span className="text-sm text-gray-500">№ {order.code}</span>
                  <span className="text-sm text-gray-500">
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
                  className="flex items-center justify-center px-4 h-[44px] bg-[#3696E7] text-white rounded-full px-6 font-medium"
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
                ) : orderDetails[order.id] ? (
                  <>
                    <h3 className="text-lg font-semibold mb-4">
                      {t("order_items")}
                    </h3>

                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">
                            {t("order_code")}:
                          </span>
                          <p className="font-medium">
                            {orderDetails[order.id].code}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">{t("date")}:</span>
                          <p className="font-medium">
                            {orderDetails[order.id].date}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">{t("items")}:</span>
                          <p className="font-medium">
                            {orderDetails[order.id].products_count}{" "}
                            {t("products")}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">{t("total")}:</span>
                          <p className="font-medium">
                            {formatPrice(orderDetails[order.id].amount_final)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {orderDetails[order.id].items?.map((item, index) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-white rounded-lg border border-gray-100"
                        >
                          <div className="block lg:hidden w-full">
                            <div className="flex items-center gap-3">
                              {/* Product image */}
                              <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Image
                                  src={
                                    item.product?.hover_image ||
                                    item.product?.product?.hover_image
                                  }
                                  alt={item.product?.title}
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
                                      {formatPrice(
                                        item.product?.price_final
                                      )}
                                    </span>
                                    {item.product?.has_discount && (
                                      <>
                                        <span className="text-xs text-gray-500 line-through">
                                          {formatPrice(
                                            item.product?.price
                                          )}
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

                          <div className="hidden lg:flex lg:items-center lg:gap-4 w-full">
                            <div className="text-lg font-semibold text-gray-600 lg:w-8">
                              {index + 1}
                            </div>

                            <div className="w-20 h-20 rounded-lg flex items-center justify-center">
                              <Image
                                src={
                                  item.product?.hover_image ||
                                  item.product?.product?.hover_image
                                }
                                alt={item.product?.title}
                                width={80}
                                height={80}
                                className="object-contain w-full h-full"
                              />
                            </div>

                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 mb-1">
                                {item.product?.title}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {item.product?.product?.brand?.title}
                              </p>
                            </div>

                            <div className="text-center lg:w-16">
                              <span className="text-lg font-semibold">
                                x{item.quantity}
                              </span>
                            </div>

                            <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-6">
                              <div className="text-center">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg font-semibold">
                                    {formatPrice(
                                      item.product?.price_final
                                    )}
                                  </span>
                                  {item.product?.has_discount && (
                                    <>
                                      <span className="text-sm text-gray-500 line-through">
                                        {formatPrice(
                                          item.product?.price
                                        )}
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
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-semibold">
                            {t("total")}:
                          </span>
                          <span className="text-sm lg:text-lg text-gray-600 block lg:hidden">
                            {orderDetails[order.id].products_count}{" "}
                            {t("products")}
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-sm lg:text-lg text-gray-600 hidden lg:block">
                            {orderDetails[order.id].products_count}{" "}
                            {t("products")} |
                          </span>
                          <span className="text-xl font-bold">
                            {formatPrice(orderDetails[order.id].amount_final)}
                          </span>
                          {orderDetails[order.id].amount !==
                            orderDetails[order.id].amount_final && (
                            <span className="text-lg text-gray-500 line-through">
                              {formatPrice(orderDetails[order.id].amount)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
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
      ))}

      {pagination.next && (
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
