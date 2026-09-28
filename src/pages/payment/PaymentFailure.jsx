import { Link, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { getBookingById } from "../../utils/dataService";

export default function PaymentFailure() {
  const { bookingId } = useParams();
  const booking = getBookingById(bookingId);

  return (
    <Layout>
      <div className="mx-auto max-w-xl px-4 py-14 md:px-8">
        <div className="card text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-100 text-3xl">❌</div>
          <h1 className="mt-4 font-display text-2xl font-bold text-ink-900">Payment failed</h1>
          <p className="mt-1 text-sm text-ink-400">
            We couldn't process your payment. No amount has been deducted.
          </p>

          {booking && (
            <div className="mt-6 rounded-xl bg-ink-50 p-5 text-left text-sm">
              <div className="flex items-center justify-between">
                <span className="text-ink-400">Service</span>
                <span className="font-semibold text-ink-800">{booking.serviceName}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-ink-400">Amount</span>
                <span className="font-semibold text-ink-800">₹{booking.price}</span>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            {booking && (
              <Link to={`/payment/${booking.id}`} className="btn-primary flex-1">
                Try Again
              </Link>
            )}
            <Link to="/bookings" className="btn-secondary flex-1">
              Back to Bookings
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
