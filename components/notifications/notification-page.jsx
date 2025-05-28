'use client';
import { useNotifications } from "@/hooks/notifications/UseNotifications";
import { getNotificationTimeGroup } from "@/lib/functions/notifications/formatNotificationTime";
import { Bell } from "lucide-react";
import { NotificationGroup } from "./notification-Group";
import { NotificationItem } from "./notification-Card";
import { useMarkNotificationsAsRead } from "@/hooks/notifications/useMarkAsRead";
import {  useEffect } from "react";
import LoadingPage from "../Loading/LoadingPage";

export function NotificationsPage() {
  const { notifications, loading, error } = useNotifications();
  const{ markAllAsRead } = useMarkNotificationsAsRead();
  useEffect(() => {
    markAllAsRead();
  }, []); 
  
  if (loading) {
    return <div className="text-center py-12"><LoadingPage/></div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  }

  const todayNotifications = notifications.filter(
    (n) => getNotificationTimeGroup(n.created_at) === "Today"
  );

  const yesterdayNotifications = notifications.filter(
    (n) => getNotificationTimeGroup(n.created_at) === "Yesterday"
  );

  const earlierNotifications = notifications.filter(
    (n) => getNotificationTimeGroup(n.created_at) === "Earlier"
  );




  return (
    <div className="container max-w-4xl mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
      </div>

      <div className="space-y-6">
        {todayNotifications.length > 0 && (
          <NotificationGroup title="Today">
            {todayNotifications.map((notification) => (
              <NotificationItem key={notification.id} {...notification} />
            ))}
          </NotificationGroup>
        )}

        {yesterdayNotifications.length > 0 && (
          <NotificationGroup title="Yesterday">
            {yesterdayNotifications.map((notification) => (
              <NotificationItem key={notification.id} {...notification} />
            ))}
          </NotificationGroup>
        )}

        {earlierNotifications.length > 0 && (
          <NotificationGroup title="Earlier">
            {earlierNotifications.map((notification) => (
              <NotificationItem key={notification.id} {...notification} />
            ))}
          </NotificationGroup>
        )}

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
              <Bell className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No notifications</h3>
            <p className="text-muted-foreground mt-1">
              You're all caught up! We'll notify you when something new happens.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
