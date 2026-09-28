import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { CATEGORIES, BOOKING_STATUS } from "../../utils/constants";
import { getBookingsByCustomer } from "../../utils/dataService";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const bookings = getBookingsByCustomer(user.id);
  const active = bookings.filter(
    (b) => ![BOOKING_STATUS.COMPLETED, BOOKING_STATUS.CANCELLED, BOOKING_STATUS.REJECTED].includes(b.status)
  );
  const completed = bookings.filter((b) => b.status === BOOKING_STATUS.COMPLETED);

  const stats = [
    { label: "Active Bookings", value: active.length, icon: "📅" },
    { label: "Completed Services", value: completed.length, icon: "✅" },
    { label: "Total Bookings", value: bookings.length, icon: "🧾" },
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">
              Hi {user.name.split(" ")[0]}, what do you need today?
            </h1>
            <p className="mt-1 text-sm text-ink-400">Here's a snapshot of your Connect account.</p>
          </div>
          <Link to="/services" className="btn-primary">
            + Book a Service
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
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
          <h2 className="font-display text-lg font-bold text-ink-900">Browse categories</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                to={`/services?category=${c.slug}`}
                className="card flex flex-col items-center gap-2 py-6 text-center transition hover:-translate-y-1 hover:shadow-pop"
              >
                <span className="text-2xl">{c.icon}</span>
                <span className="text-xs font-semibold text-ink-800">{c.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-ink-900">Recent bookings</h2>
            <Link to="/bookings" className="text-sm font-semibold text-violet-600 hover:underline">
              View all →
            </Link>
          </div>
          {bookings.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                icon="🗓️"
                title="No bookings yet"
                subtitle="Book your first service and it'll show up here."
                action={
                  <Link to="/services" className="btn-primary">
                    Browse Services
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {bookings.slice(0, 4).map((b) => (
                <Link
                  to="/bookings"
                  key={b.id}
                  className="card flex flex-wrap items-center justify-between gap-3 transition hover:shadow-pop"
                >
                  <div>
                    <p className="font-bold text-ink-900">{b.serviceName}</p>
                    <p className="text-xs text-ink-400">
                      {b.date} · {b.time}
                    </p>
                  </div>
                  <StatusBadge status={b.status} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
