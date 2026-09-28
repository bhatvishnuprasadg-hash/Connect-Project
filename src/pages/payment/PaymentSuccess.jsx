import { Link, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { getBookingById, getUserById } from "../../utils/dataService";

export default function PaymentSuccess() {
  const { bookingId } = useParams();
  const booking = getBookingById(bookingId);

  if (!booking || !booking.payment) {
    return (
      <Layout>
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <p className="font-display text-xl font-bold text-ink-900">Receipt not found</p>
          <Link to="/bookings" className="btn-primary mt-4 inline-flex">
            Back to my bookings
          </Link>
        </div>
      </Layout>
    );
  }

  const provider = getUserById(booking.providerId);

  return (
    <Layout>
      <div className="mx-auto max-w-xl px-4 py-14 md:px-8">
        <div className="card text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl">✅</div>
          <h1 className="mt-4 font-display text-2xl font-bold text-ink-900">Payment successful!</h1>
          <p className="mt-1 text-sm text-ink-400">Your booking is now confirmed.</p>

          <div className="mt-6 space-y-3 rounded-xl bg-ink-50 p-5 text-left text-sm">
            <Row label="Service" value={booking.serviceName} />
            <Row label="Provider" value={provider?.name} />
            <Row label="Date & time" value={`${booking.date} · ${booking.time}`} />
            <Row label="Payment method" value={booking.payment.method} />
            <Row label="Transaction ID" value={booking.payment.transactionId} />
            <Row label="Paid on" value={new Date(booking.payment.date).toLocaleString()} />
            <div className="flex items-center justify-between border-t border-ink-200 pt-3">
              <span className="font-bold text-ink-900">Amount paid</span>
              <span className="font-display text-lg font-bold text-emerald-600">₹{booking.payment.amount}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link to="/bookings" className="btn-primary flex-1">
              View My Bookings
            </Link>
            <button onClick={() => window.print()} className="btn-secondary flex-1">
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-400">{label}</span>
      <span className="font-semibold text-ink-800">{value}</span>
    </div>
  );
}
