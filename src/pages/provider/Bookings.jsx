import { useState } from "react";
import Layout from "../../components/Layout";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { useNotificationBus } from "../../context/NotificationContext";
import { BOOKING_STATUS } from "../../utils/constants";
import {
  getBookingsByProvider,
  getUserById,
  acceptBooking,
  rejectBooking,
  startService,
  completeService,
  respondToReschedule,
} from "../../utils/dataService";

const TABS = [
  { id: "requests", label: "New Requests" },
  { id: "upcoming", label: "Upcoming" },
  { id: "history", label: "History" },
];

export default function ProviderBookings() {
  const { user } = useAuth();
  const { bump } = useNotificationBus();
  const [tab, setTab] = useState("requests");
  const [, setRefreshKey] = useState(0);

  const bookings = getBookingsByProvider(user.id);
  const refresh = () => {
    bump();
    setRefreshKey((k) => k + 1);
  };

  const requests = bookings.filter((b) =>
    [BOOKING_STATUS.PENDING, BOOKING_STATUS.RESCHEDULE_REQUESTED].includes(b.status)
  );
  const upcoming = bookings.filter((b) =>
    [BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.PAYMENT_PENDING, BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.IN_PROGRESS, BOOKING_STATUS.RESCHEDULED].includes(
      b.status
    )
  );
  const history = bookings.filter((b) =>
    [BOOKING_STATUS.COMPLETED, BOOKING_STATUS.CANCELLED, BOOKING_STATUS.REJECTED].includes(b.status)
  );

  const list = tab === "requests" ? requests : tab === "upcoming" ? upcoming : history;

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
        <h1 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">Bookings</h1>
        <p className="mt-1 text-sm text-ink-400">Manage requests and track jobs from start to finish.</p>

        <div className="mt-6 flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === t.id ? "bg-connect-gradient text-white" : "bg-white text-ink-600 hover:bg-ink-100"
              }`}
            >
              {t.label}{" "}
              {t.id === "requests" && requests.length > 0 && (
                <span className="ml-1 rounded-full bg-white/30 px-1.5 text-xs">{requests.length}</span>
              )}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="mt-6">
            <EmptyState icon="🗂️" title="Nothing here" subtitle="Bookings in this category will appear here." />
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {list.map((b) => (
              <BookingRow key={b.id} booking={b} onChange={refresh} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

function BookingRow({ booking: b, onChange }) {
  const customer = getUserById(b.customerId);
  const lastReschedule = b.rescheduleHistory?.[b.rescheduleHistory.length - 1];

  function act(fn, ...args) {
    fn(...args);
    onChange();
  }

  return (
    <div className="card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg font-bold text-ink-900">{b.serviceName}</p>
          <p className="text-xs text-ink-400">Customer: {customer?.name} · {customer?.phone}</p>
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
      <p className="mt-2 text-xs text-ink-400">📍 {b.address}</p>
      {b.notes && <p className="mt-1 text-xs text-ink-500">Note: {b.notes}</p>}

      {b.status === BOOKING_STATUS.RESCHEDULE_REQUESTED && lastReschedule && (
        <div className="mt-3 rounded-lg bg-fuchsia-50 px-3 py-2 text-xs text-fuchsia-700">
          Customer requested {lastReschedule.requestedDate} at {lastReschedule.requestedTime}
        </div>
      )}
      {b.status === BOOKING_STATUS.CANCELLED && b.cancellation && (
        <div className="mt-3 rounded-lg bg-ink-100 px-3 py-2 text-xs text-ink-600">
          Cancelled by {b.cancellation.cancelledBy}: {b.cancellation.reason}
        </div>
      )}
      {b.status === BOOKING_STATUS.REJECTED && (
        <div className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600">
          You rejected this booking.
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2 border-t border-ink-100 pt-4">
        {b.status === BOOKING_STATUS.PENDING && (
          <>
            <button onClick={() => act(acceptBooking, b)} className="btn-primary !px-4 !py-1.5 text-xs">
              Accept
            </button>
            <button onClick={() => act(rejectBooking, b, "Not available at this time")} className="btn-danger !px-4 !py-1.5 text-xs">
              Reject
            </button>
          </>
        )}
        {b.status === BOOKING_STATUS.RESCHEDULE_REQUESTED && (
          <>
            <button onClick={() => act(respondToReschedule, b, true)} className="btn-primary !px-4 !py-1.5 text-xs">
              Approve New Time
            </button>
            <button onClick={() => act(respondToReschedule, b, false)} className="btn-danger !px-4 !py-1.5 text-xs">
              Reject
            </button>
          </>
        )}
        {b.status === BOOKING_STATUS.CONFIRMED && (
          <button onClick={() => act(startService, b)} className="btn-primary !px-4 !py-1.5 text-xs">
            Mark In Progress
          </button>
        )}
        {b.status === BOOKING_STATUS.IN_PROGRESS && (
          <button onClick={() => act(completeService, b)} className="btn-primary !px-4 !py-1.5 text-xs">
            Mark Completed
          </button>
        )}
        {b.status === BOOKING_STATUS.RESCHEDULED && (
          <button onClick={() => act(startService, b)} className="btn-primary !px-4 !py-1.5 text-xs">
            Mark In Progress
          </button>
        )}
        {b.status === BOOKING_STATUS.PAYMENT_PENDING && (
          <span className="text-xs font-semibold text-amber-600">Waiting for customer payment…</span>
        )}
      </div>
    </div>
  );
}
