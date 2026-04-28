"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Trash2, BellOff, CheckCheck, Loader2 } from "lucide-react";
import { notificationsService } from "@/lib/notificationsService";

const PAGE_LIMIT = 30;

function getRelativeTime(dateRaw, locale) {
  try {
    const diff = Date.now() - new Date(dateRaw).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

    if (days >= 1) return rtf.format(-days, "day");
    if (hours >= 1) return rtf.format(-hours, "hour");
    if (minutes >= 1) return rtf.format(-minutes, "minute");
    return rtf.format(0, "minute");
  } catch {
    return dateRaw;
  }
}

function NotificationSkeleton() {
  return (
    <div className="flex gap-3 p-4 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [bulkLoading, setBulkLoading] = useState(null);

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
    if (!notification.is_read) {
      setNotifications((prev) =>
        prev.map((n) => (n.uuid === notification.uuid ? { ...n, is_read: true } : n))
      );
      try {
        await notificationsService.markAsRead(notification.uuid);
      } catch {
        setNotifications((prev) =>
          prev.map((n) => (n.uuid === notification.uuid ? { ...n, is_read: false } : n))
        );
      }
    }

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

  const handleDelete = async (e, uuid) => {
    e.stopPropagation();
    setActionLoading((prev) => ({ ...prev, [uuid]: true }));
    try {
      await notificationsService.deleteNotification(uuid);
      setNotifications((prev) => prev.filter((n) => n.uuid !== uuid));
      setPagination((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
    } catch (err) {
      console.error("Error deleting notification:", err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [uuid]: false }));
    }
  };

  const handleMarkAllRead = async () => {
    setBulkLoading("read");
    try {
      await notificationsService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Error marking all as read:", err);
    } finally {
      setBulkLoading(null);
    }
  };

  const handleDeleteAll = async () => {
    setBulkLoading("delete");
    try {
      await notificationsService.deleteAll();
      setNotifications([]);
      setPagination({ current_page: 1, last_page: 1, total: 0 });
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
                  {t("mark_all_read") || "Hamısını oxu"}
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
                {t("delete_all") || "Hamısını sil"}
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
            {[1, 2, 3, 4, 5].map((i) => (
              <NotificationSkeleton key={i} />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
            <BellOff className="w-14 h-14 text-gray-300" />
            <p className="text-lg font-medium">
              {t("no_notifications") || "Bildiriş yoxdur"}
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.uuid}
                notification={notification}
                locale={locale}
                actionLoading={actionLoading[notification.uuid]}
                onDelete={handleDelete}
                onClick={handleNotificationClick}
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
                t("load_more") || "Daha çox göstər"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationItem({ notification, locale, actionLoading, onDelete, onClick }) {
  const isClickable = notification.action_type && notification.action_type !== "none";

  return (
    <div
      className={`flex items-start gap-3 p-4 transition-colors group ${
        !notification.is_read ? "bg-blue-50/40" : "bg-white"
      } ${isClickable ? "cursor-pointer hover:bg-gray-50" : ""}`}
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
            !notification.is_read ? "font-semibold text-gray-900" : "font-medium text-gray-700"
          }`}
        >
          {notification.title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
          {notification.body}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {getRelativeTime(notification.date_raw, locale)}
        </p>
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => onDelete(e, notification.uuid)}
        disabled={actionLoading}
        className="shrink-0 p-1.5 rounded-md text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-30 mt-0.5"
        title="Sil"
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
