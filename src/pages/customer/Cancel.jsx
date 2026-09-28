import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import StatusBadge from "../../components/StatusBadge";
import { CANCELLATION_REASONS } from "../../utils/constants";
import { getBookingById, cancelBooking } from "../../utils/dataService";
import { useAuth } from "../../context/AuthContext";
import { useNotificationBus } from "../../context/NotificationContext";

export default function Cancel() {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { bump } = useNotificationBus();
  const booking = getBookingById(bookingId);
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
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
    cancelBooking(booking, { reason, note, cancelledBy: "customer" });
    bump();
    setTimeout(() => navigate(`/bookings?highlight=${booking.id}`), 300);
  }

  return (
    <Layout>
      <div className="mx-auto max-w-xl px-4 py-10 md:px-8">
        <h1 className="font-display text-2xl font-bold text-ink-900">Cancel booking</h1>
        <p className="mt-1 text-sm text-ink-400">
          {booking.serviceName} · currently <StatusBadge status={booking.status} />
        </p>

        <form onSubmit={handleSubmit} className="card mt-6 space-y-5">
          <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
            This will cancel your booking for {booking.date} at {booking.time}. This can't be undone.
          </div>
          <div>
            <label className="label">Reason for cancellation</label>
            <div className="space-y-2">
              {CANCELLATION_REASONS.map((r) => (
                <label
                  key={r}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition ${
                    reason === r ? "border-violet-500 bg-violet-50" : "border-ink-200 hover:bg-ink-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r}
                    checked={reason === r}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    className="accent-violet-600"
                  />
                  {r}
                </label>
              ))}
            </div>
          </div>
          {reason === "Other" && (
            <div>
              <label className="label">Tell us more</label>
              <textarea
                rows={3}
                className="input"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional details"
              />
            </div>
          )}
          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="btn-danger flex-1">
              {submitting ? "Cancelling…" : "Confirm Cancellation"}
            </button>
            <Link to="/bookings" className="btn-ghost">
              Keep Booking
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}
