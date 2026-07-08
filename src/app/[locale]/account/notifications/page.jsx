"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import {
  Trash2,
  BellOff,
  CheckCheck,
  Loader2,
  X,
  ExternalLink,
} from "lucide-react";
import { notificationsService } from "@/lib/notificationsService";
import { AccountListLoading } from "@/components/account/account-loading";

function dispatchNotificationRead(count = 1) {
  window.dispatchEvent(
    new CustomEvent("notificationRead", { detail: { count } })
  );
}

export default function NotificationsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [bulkLoading, setBulkLoading] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const fetchNotifications = useCallback(async (page = 1, append = false) => {
    try {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await notificationsService.getNotifications(page);
      const { data, meta } = res.data;

      setNotifications((prev) => (append ? [...prev, ...data] : data));
      setPagination({
        current_page: meta.current_page,
        last_page: meta.last_page,
        total: meta.total,
      });
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(1);
  }, [fetchNotifications]);

  const handleNotificationClick = async (notification) => {
    setSelectedNotification(notification);

    if (!notification.is_read) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, is_read: true } : n
        )
      );
      dispatchNotificationRead(1);
      try {
        await notificationsService.markAsRead(notification.id);
      } catch {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, is_read: false } : n
          )
        );
        dispatchNotificationRead(-1);
      }
    }
  };

  const handleNotificationNavigate = (notification) => {
    setSelectedNotification(null);
    switch (notification.action_type) {
      case "order":
        router.push(`/${locale}/account/orders/${notification.action_id}`);
        break;
      case "product":
        router.push(`/${locale}/products/${notification.action_id}`);
        break;
      case "category":
        router.push(`/${locale}/${notification.action_id}`);
        break;
      case "url":
        window.open(notification.action_id, "_blank", "noopener,noreferrer");
        break;
      default:
        break;
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    const target = notifications.find((n) => n.id === id);
    try {
      await notificationsService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setPagination((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));
      if (target && !target.is_read) dispatchNotificationRead(1);
    } catch (err) {
      console.error("Error deleting notification:", err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleMarkAllRead = async () => {
    setBulkLoading("read");
    const unreadCount = notifications.filter((n) => !n.is_read).length;
    try {
      await notificationsService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      if (unreadCount > 0) dispatchNotificationRead(unreadCount);
    } catch (err) {
      console.error("Error marking all as read:", err);
    } finally {
      setBulkLoading(null);
    }
  };

  const handleDeleteAll = async () => {
    setBulkLoading("delete");
    const unreadCount = notifications.filter((n) => !n.is_read).length;
    try {
      await notificationsService.deleteAll();
      setNotifications([]);
      setPagination({ current_page: 1, last_page: 1, total: 0 });
      if (unreadCount > 0) dispatchNotificationRead(unreadCount);
    } catch (err) {
      console.error("Error deleting all notifications:", err);
    } finally {
      setBulkLoading(null);
    }
  };

  const handleLoadMore = () => {
    if (pagination.current_page < pagination.last_page && !loadingMore) {
      fetchNotifications(pagination.current_page + 1, true);
    }
  };

  const hasMore = pagination.current_page < pagination.last_page;
  const hasUnread = notifications.some((n) => !n.is_read);

  return (
    <>
      <div className="container">
        <div className="flex flex-col gap-6 py-10">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">
              {t("notifications")}
            </h1>

            {notifications.length > 0 && (
              <div className="flex items-center gap-2">
                {hasUnread && (
                  <button
                    onClick={handleMarkAllRead}
                    disabled={bulkLoading !== null}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#3696E7] border border-[#3696E7] rounded-full hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bulkLoading === "read" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCheck className="w-4 h-4" />
                    )}
                    {t("mark_all_read")}
                  </button>
                )}
                <button
                  onClick={handleDeleteAll}
                  disabled={bulkLoading !== null}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 border border-red-300 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bulkLoading === "delete" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  {t("delete_all")}
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          {loading ? (
            <AccountListLoading count={5} contained />
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
              <BellOff className="w-14 h-14 text-gray-300" />
              <p className="text-lg font-medium">{t("no_notifications")}</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  actionLoading={actionLoading[notification.id]}
                  onDelete={handleDelete}
                  onClick={handleNotificationClick}
                  t={t}
                />
              ))}
            </div>
          )}

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="flex items-center gap-2 px-6 py-3 bg-[#3696E7] text-white rounded-full font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t("loading")}
                  </>
                ) : (
                  t("load_more")
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedNotification && (
        <NotificationModal
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
          onNavigate={handleNotificationNavigate}
          t={t}
        />
      )}
    </>
  );
}

function NotificationItem({
  notification,
  actionLoading,
  onDelete,
  onClick,
  t,
}) {
  return (
    <div
      className={`flex items-start gap-3 p-4 transition-colors group cursor-pointer ${
        !notification.is_read ? "bg-blue-50/40" : "bg-white"
      } hover:bg-gray-50`}
      onClick={() => onClick(notification)}
    >
      {/* Unread dot */}
      <div className="relative shrink-0 mt-1">
        {!notification.is_read && (
          <span className="absolute -top-0.5 -left-0.5 w-2 h-2 rounded-full bg-[#3696E7] z-10" />
        )}
        {notification.image ? (
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100">
            <Image
              src={notification.image}
              alt={notification.title}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Image
              src="/icons/notification.svg"
              alt="notification"
              width={20}
              height={20}
              className="w-5 h-5 opacity-60"
            />
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-snug ${
            !notification.is_read
              ? "font-semibold text-gray-900"
              : "font-medium text-gray-700"
          }`}
        >
          {notification.title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
          {notification.body}
        </p>
        <p className="text-xs text-gray-400 mt-1">{notification.date}</p>
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => onDelete(e, notification.id)}
        disabled={actionLoading}
        className="shrink-0 p-1.5 rounded-md text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-30 mt-0.5"
        title={t("delete")}
      >
        {actionLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}

function NotificationModal({ notification, onClose, onNavigate, t }) {
  const hasAction =
    notification.action_type && notification.action_type !== "none";

  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image */}
        {notification.image && (
          <div className="w-full h-44 overflow-hidden">
            <Image
              src={notification.image}
              alt={notification.title}
              width={448}
              height={176}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          {/* Icon + Title */}
          <div className="flex items-start gap-3 mb-3">
            {!notification.image && (
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <Image
                  src="/icons/notification.svg"
                  alt="notification"
                  width={20}
                  height={20}
                  className="w-5 h-5 opacity-60"
                />
              </div>
            )}
            <h2 className="text-base font-semibold text-gray-900 leading-snug pt-1">
              {notification.title}
            </h2>
          </div>

          {/* Body */}
          {notification.body && (
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {notification.body}
            </p>
          )}

          {/* Date */}
          {notification.date && (
            <p className="text-xs text-gray-400 mb-5">{notification.date}</p>
          )}

          {/* Action button */}
          {hasAction && (
            <button
              onClick={() => onNavigate(notification)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#3696E7] text-white text-sm font-medium rounded-xl hover:bg-blue-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              {t("view_details")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
