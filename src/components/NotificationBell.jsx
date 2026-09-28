import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotificationBus } from "../context/NotificationContext";
import { getNotifications, markAllNotificationsRead } from "../utils/dataService";

const TYPE_ICON = {
  "Booking Accepted": "✅",
  "Booking Rejected": "❌",
  "Booking Rescheduled": "🔁",
  "Booking Cancelled": "🚫",
  "Service Started": "🛠️",
  "Service Completed": "🎉",
  "Payment Successful": "💸",
  "New Booking Request": "📩",
  "Reschedule Request": "🔁",
  "New Review": "⭐",
};

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function NotificationBell() {
  const { user } = useAuth();
  const { tick, bump } = useNotificationBus();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const notifications = user ? getNotifications(user.id) : [];
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next && unread > 0) {
            markAllNotificationsRead(user.id);
            bump();
          }
        }}
        className="relative grid h-10 w-10 place-items-center rounded-full text-lg text-ink-600 transition hover:bg-ink-100"
        aria-label="Notifications"
      >
        🔔
        {unread > 0 && (
          <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-magenta-500 ring-2 ring-white" />
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-2 w-80 overflow-hidden rounded-xl2 border border-ink-100 bg-white shadow-pop">
          <div className="border-b border-ink-100 px-4 py-3 font-display font-bold text-ink-900">
            Notifications
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-ink-400">
                You're all caught up.
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="flex gap-3 border-b border-ink-50 px-4 py-3 last:border-0 hover:bg-ink-50"
                >
                  <div className="text-lg">{TYPE_ICON[n.type] || "🔔"}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink-800">{n.type}</p>
                    <p className="truncate-2-lines text-xs text-ink-600">{n.message}</p>
                    <p className="mt-0.5 text-[11px] text-ink-400">{timeAgo(n.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
