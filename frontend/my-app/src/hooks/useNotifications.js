import { useEffect, useState, useCallback } from "react";
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../services/notificationsService";

/**
 * useNotifications
 *
 * Options:
 *  - initialLimit: number (default 20)
 *  - onlyUnread: boolean (default false)
 */
export function useNotifications({
  initialLimit = 20,
  onlyUnread = false,
} = {}) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(
    async ({ unread = onlyUnread } = {}) => {
      setLoading(true);
      setError(null);
      try {
        const [list, unreadRes] = await Promise.all([
          getNotifications({
            limit: initialLimit,
            sort: "desc",
            unread,
          }),
          getUnreadCount(),
        ]);

        setNotifications(list || []);
        setUnreadCount(unreadRes?.count || 0);
      } catch (err) {
        console.error("Failed to load notifications:", err);
        setError(err);
      } finally {
        setLoading(false);
        setInitialLoaded(true);
      }
    },
    [initialLimit, onlyUnread]
  );

  const markOneRead = useCallback(
    async (id) => {
      try {
        const updated = await markNotificationRead(id);
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? updated : n))
        );
        // Only adjust if this one was previously unread
        setUnreadCount((c) => {
          const wasUnread = notifications.find(
            (n) => n._id === id && !n.isRead
          );
          return wasUnread ? Math.max(0, c - 1) : c;
        });
      } catch (err) {
        console.error("Failed to mark notification read:", err);
        setError(err);
      }
    },
    [notifications]
  );

  const markAllRead = useCallback(async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      setError(err);
    }
  }, []);

  const removeNotification = useCallback(
    async (id) => {
      try {
        await deleteNotification(id);
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        // If it was unread, reflect in count
        setUnreadCount((c) => {
          const wasUnread = notifications.find(
            (n) => n._id === id && !n.isRead
          );
          return wasUnread ? Math.max(0, c - 1) : c;
        });
      } catch (err) {
        console.error("Failed to delete notification:", err);
        setError(err);
      }
    },
    [notifications]
  );

  useEffect(() => {
    load();
  }, [load]);

  return {
    notifications,
    unreadCount,
    loading,
    initialLoaded,
    error,
    hasUnread: unreadCount > 0,
    reload: load,
    markOneRead,
    markAllRead,
    removeNotification,
    setNotifications, // exposed in case you want optimistic updates
  };
}
