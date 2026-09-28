import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "../../components/Layout";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { BOOKING_STATUS } from "../../utils/constants";
import { getBookingsByCustomer, getUserById } from "../../utils/dataService";

const TABS = [
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled / Rejected" },
  { id: "all", label: "All" },
];

const ACTIVE_SET = [
  BOOKING_STATUS.PENDING,
  BOOKING_STATUS.ACCEPTED,
  BOOKING_STATUS.PAYMENT_PENDING,
  BOOKING_STATUS.CONFIRMED,
  BOOKING_STATUS.IN_PROGRESS,
  BOOKING_STATUS.RESCHEDULE_REQUESTED,
  BOOKING_STATUS.RESCHEDULED,
];

export default function BookingHistory() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const highlight = params.get("highlight");
  const [tab, setTab] = useState("active");

  const bookings = getBookingsByCustomer(user.id);
  const filtered = bookings.filter((b) => {
    if (tab === "active") return ACTIVE_SET.includes(b.status);
    if (tab === "completed") return b.status === BOOKING_STATUS.COMPLETED;
    if (tab === "cancelled")
      return [BOOKING_STATUS.CANCELLED, BOOKING_STATUS.REJECTED].includes(b.status);
    return true;
  });

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
        <h1 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">My Bookings</h1>
        <p className="mt-1 text-sm text-ink-400">Track, pay, reschedule or cancel your services.</p>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === t.id ? "bg-connect-gradient text-white" : "bg-white text-ink-600 hover:bg-ink-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon="🗓️"
              title="Nothing here yet"
              subtitle="Bookings in this category will show up here."
              action={
                <Link to="/services" className="btn-primary">
                  Browse Services
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filtered.map((b) => {
              const provider = getUserById(b.providerId);
              const canPay = b.status === BOOKING_STATUS.PAYMENT_PENDING;
              const canReschedule = [
                BOOKING_STATUS.PENDING,
                BOOKING_STATUS.ACCEPTED,
                BOOKING_STATUS.PAYMENT_PENDING,
                BOOKING_STATUS.CONFIRMED,
                BOOKING_STATUS.RESCHEDULED,
              ].includes(b.status);
              const canCancel = canReschedule;
              const canReview = b.status === BOOKING_STATUS.COMPLETED && !b.reviewed;

              return (
                <div
                  key={b.id}
                  className={`card ${highlight === b.id ? "ring-2 ring-violet-400" : ""}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-lg font-bold text-ink-900">{b.serviceName}</p>
                      <p className="text-xs text-ink-400">with {provider?.name}</p>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                    <div>
                      <p className="text-xs text-ink-400">Date</p>
                      <p className="font-semibold text-ink-800">{b.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-ink-400">Time</p>
                      <p className="font-semibold text-ink-800">{b.time}</p>
                    </div>
                    <div>
                      <p className="text-xs text-ink-400">Price</p>
                      <p className="font-semibold text-ink-800">₹{b.price}</p>
                    </div>
                    <div>
                      <p className="text-xs text-ink-400">Payment</p>
                      <p className="font-semibold text-ink-800">{b.payment?.status || "Unpaid"}</p>
                    </div>
                  </div>

                  {b.status === BOOKING_STATUS.REJECTED && b.rejectionReason && (
                    <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600">
                      Rejected: {b.rejectionReason}
                    </p>
                  )}
                  {b.status === BOOKING_STATUS.CANCELLED && b.cancellation && (
                    <p className="mt-3 rounded-lg bg-ink-100 px-3 py-2 text-xs text-ink-600">
                      Cancelled by {b.cancellation.cancelledBy} · {b.cancellation.reason}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2 border-t border-ink-100 pt-4">
                    {canPay && (
                      <Link to={`/payment/${b.id}`} className="btn-primary">
                        Pay Now
                      </Link>
                    )}
                    {canReview && (
                      <Link to={`/feedback/${b.id}`} className="btn-primary">
                        Rate &amp; Review
                      </Link>
                    )}
                    {canReschedule && (
                      <Link to={`/reschedule/${b.id}`} className="btn-secondary">
                        Reschedule
                      </Link>
                    )}
                    {canCancel && (
                      <Link to={`/cancel/${b.id}`} className="btn-danger">
                        Cancel Booking
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
