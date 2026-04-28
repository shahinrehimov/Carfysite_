import { api } from "@/lib/axios/api";

export const notificationsService = {
  getNotifications: (page = 1) =>
    api.get(`/notifications/load?page=${page}`),

  getUnreadCount: () =>
    api.get("/notifications/unread-count"),

  markAsRead: (uuid) =>
    api.post(`/notifications/${uuid}/read`),

  markAllAsRead: () =>
    api.post("/notifications/read-all"),

  deleteNotification: (uuid) =>
    api.delete(`/notifications/${uuid}/delete`),

  deleteAll: () =>
    api.delete("/notifications/delete-all"),
};
