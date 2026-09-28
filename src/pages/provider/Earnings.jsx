import Layout from "../../components/Layout";
import EmptyState from "../../components/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { getProviderEarnings } from "../../utils/dataService";

export default function Earnings() {
  const { user } = useAuth();
  const { totalEarnings, paidCount, completedCount, upcomingCount, bookings } = getProviderEarnings(user.id);
  const paidBookings = bookings
    .filter((b) => b.payment?.status === "Paid")
    .sort((a, b) => new Date(b.payment.date) - new Date(a.payment.date))
    .reverse();

  const stats = [
    { label: "Total Earnings", value: `₹${totalEarnings}`, icon: "💰" },
    { label: "Paid Bookings", value: paidCount, icon: "🧾" },
    { label: "Completed Jobs", value: completedCount, icon: "✅" },
    { label: "Upcoming Jobs", value: upcomingCount, icon: "📅" },
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
        <h1 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">Earnings</h1>
        <p className="mt-1 text-sm text-ink-400">Track your income from completed and paid bookings.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="card flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-violet-50 text-2xl">{s.icon}</span>
              <div>
                <p className="text-2xl font-bold text-ink-900">{s.value}</p>
                <p className="text-xs font-semibold text-ink-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="font-display text-lg font-bold text-ink-900">Payment history</h2>
          {paidBookings.length === 0 ? (
            <div className="mt-4">
              <EmptyState icon="💸" title="No payments yet" subtitle="Completed and paid bookings will show up here." />
            </div>
          ) : (
            <div className="card mt-4 divide-y divide-ink-50">
              {paidBookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-semibold text-ink-800">{b.serviceName}</p>
                    <p className="text-xs text-ink-400">
                      {new Date(b.payment.date).toLocaleDateString()} · {b.payment.method} · {b.payment.transactionId}
                    </p>
                  </div>
                  <p className="font-bold text-emerald-600">+₹{b.payment.amount}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
