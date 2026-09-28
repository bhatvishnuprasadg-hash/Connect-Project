import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import StatusBadge from "../../components/StatusBadge";
import StarRating from "../../components/StarRating";
import EmptyState from "../../components/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { useNotificationBus } from "../../context/NotificationContext";
import { BOOKING_STATUS } from "../../utils/constants";
import {
  getBookingsByProvider,
  getServicesByProvider,
  getProviderRating,
  getProviderEarnings,
  acceptBooking,
  rejectBooking,
} from "../../utils/dataService";

export default function ProviderDashboard() {
  const { user } = useAuth();
  const { bump } = useNotificationBus();
  const bookings = getBookingsByProvider(user.id);
  const services = getServicesByProvider(user.id);
  const rating = getProviderRating(user.id);
  const earnings = getProviderEarnings(user.id);
  const pending = bookings.filter((b) => b.status === BOOKING_STATUS.PENDING);

  const stats = [
    { label: "Pending Requests", value: pending.length, icon: "📩" },
    { label: "Active Listings", value: services.filter((s) => s.active).length, icon: "🧰" },
    { label: "Avg. Rating", value: rating.avg || "—", icon: "⭐" },
    { label: "Total Earnings", value: `₹${earnings.totalEarnings}`, icon: "💰" },
  ];

  function handleAccept(b) {
    acceptBooking(b);
    bump();
  }
  function handleReject(b) {
    rejectBooking(b, "Not available at this time");
    bump();
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">
              Welcome back, {user.name.split(" ")[0]}
            </h1>
            <p className="mt-1 text-sm text-ink-400">Here's what's happening with your services.</p>
          </div>
          <Link to="/provider/services" className="btn-primary">
            + Add Service
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="card flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-violet-50 text-2xl">
                {s.icon}
              </span>
              <div>
                <p className="text-2xl font-bold text-ink-900">{s.value}</p>
                <p className="text-xs font-semibold text-ink-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-ink-900">New booking requests</h2>
            <Link to="/provider/bookings" className="text-sm font-semibold text-violet-600 hover:underline">
              View all bookings →
            </Link>
          </div>
          {pending.length === 0 ? (
            <div className="mt-4">
              <EmptyState icon="📭" title="No pending requests" subtitle="New booking requests will appear here." />
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {pending.map((b) => (
                <div key={b.id} className="card flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-ink-900">{b.serviceName}</p>
                    <p className="text-xs text-ink-400">
                      {b.date} · {b.time} · ₹{b.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={b.status} />
                    <button onClick={() => handleAccept(b)} className="btn-primary !px-4 !py-1.5 text-xs">
                      Accept
                    </button>
                    <button onClick={() => handleReject(b)} className="btn-danger !px-4 !py-1.5 text-xs">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
