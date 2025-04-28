import { isToday, isYesterday, formatDistanceToNowStrict } from "date-fns";

export function getNotificationTimeGroup(createdAt) {
  const date = new Date(createdAt);

  if (isToday(date)) {
    return "Today";
  }

  if (isYesterday(date)) {
    return "Yesterday";
  }

  return "Earlier"; // Anything older
}

