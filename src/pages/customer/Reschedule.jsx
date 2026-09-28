import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import StatusBadge from "../../components/StatusBadge";
import { TIME_SLOTS } from "../../utils/constants";
import { getBookingById, requestReschedule } from "../../utils/dataService";
import { useAuth } from "../../context/AuthContext";
import { useNotificationBus } from "../../context/NotificationContext";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function Reschedule() {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { bump } = useNotificationBus();
  const booking = getBookingById(bookingId);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!booking || booking.customerId !== user.id) {
    return (
      <Layout>
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <p className="font-display text-xl font-bold text-ink-900">Booking not found</p>
          <Link to="/bookings" className="btn-primary mt-4 inline-flex">
            Back to my bookings
          </Link>
        </div>
      </Layout>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    requestReschedule(booking, { date, time, requestedBy: "customer" });
    bump();
    setTimeout(() => navigate(`/bookings?highlight=${booking.id}`), 300);
  }

  return (
    <Layout>
      <div className="mx-auto max-w-xl px-4 py-10 md:px-8">
        <h1 className="font-display text-2xl font-bold text-ink-900">Request a reschedule</h1>
        <p className="mt-1 text-sm text-ink-400">
          {booking.serviceName} · currently <StatusBadge status={booking.status} />
        </p>

        <form onSubmit={handleSubmit} className="card mt-6 space-y-5">
          <div className="rounded-lg bg-ink-50 px-4 py-3 text-sm text-ink-600">
            Current slot: <span className="font-semibold">{booking.date} at {booking.time}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">New date</label>
              <input
                type="date"
                required
                min={todayISO()}
                className="input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="label">New time</label>
              <select required className="input" value={time} onChange={(e) => setTime(e.target.value)}>
                <option value="">Select slot</option>
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-xs text-ink-400">
            Your provider will need to approve this new slot before it's confirmed.
          </p>
          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? "Sending…" : "Send Reschedule Request"}
            </button>
            <Link to="/bookings" className="btn-ghost">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}
