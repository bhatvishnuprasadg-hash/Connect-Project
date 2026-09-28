import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { PAYMENT_METHODS, BOOKING_STATUS } from "../../utils/constants";
import { getBookingById, getUserById, payForBooking } from "../../utils/dataService";
import { useAuth } from "../../context/AuthContext";
import { useNotificationBus } from "../../context/NotificationContext";

export default function Payment() {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { bump } = useNotificationBus();
  const booking = getBookingById(bookingId);
  const [method, setMethod] = useState("upi");
  const [fields, setFields] = useState({ upi: "", cardNumber: "", cardExpiry: "", cardCvv: "", bank: "", wallet: "" });
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [processing, setProcessing] = useState(false);

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

  if (booking.status !== BOOKING_STATUS.PAYMENT_PENDING) {
    return (
      <Layout>
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <p className="font-display text-xl font-bold text-ink-900">No payment due</p>
          <p className="mt-2 text-sm text-ink-400">This booking isn't awaiting payment right now.</p>
          <Link to="/bookings" className="btn-primary mt-4 inline-flex">
            Back to my bookings
          </Link>
        </div>
      </Layout>
    );
  }

  const provider = getUserById(booking.providerId);

  function handlePay(e) {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      const methodLabel = PAYMENT_METHODS.find((m) => m.id === method)?.label;
      payForBooking(booking, { method: methodLabel, success: !simulateFailure });
      bump();
      navigate(simulateFailure ? `/payment/failure/${booking.id}` : `/payment/success/${booking.id}`);
    }, 900);
  }

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-8">
        <h1 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">Complete payment</h1>
        <p className="mt-1 text-sm text-ink-400">
          {booking.serviceName} with {provider?.name}
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_260px]">
          <form onSubmit={handlePay} className="card space-y-5">
            <div>
              <label className="label">Choose payment method</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`rounded-xl border px-3 py-3 text-center text-sm font-semibold transition ${
                      method === m.id ? "border-violet-500 bg-violet-50 text-violet-700" : "border-ink-200 text-ink-600 hover:bg-ink-50"
                    }`}
                  >
                    <span className="block text-lg">{m.icon}</span>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {method === "upi" && (
              <div>
                <label className="label">UPI ID</label>
                <input
                  required
                  className="input"
                  placeholder="yourname@upi"
                  value={fields.upi}
                  onChange={(e) => setFields({ ...fields, upi: e.target.value })}
                />
              </div>
            )}

            {(method === "credit-card" || method === "debit-card") && (
              <div className="space-y-4">
                <div>
                  <label className="label">Card number</label>
                  <input
                    required
                    maxLength={19}
                    className="input"
                    placeholder="1234 5678 9012 3456"
                    value={fields.cardNumber}
                    onChange={(e) => setFields({ ...fields, cardNumber: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Expiry</label>
                    <input
                      required
                      className="input"
                      placeholder="MM/YY"
                      value={fields.cardExpiry}
                      onChange={(e) => setFields({ ...fields, cardExpiry: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">CVV</label>
                    <input
                      required
                      maxLength={3}
                      type="password"
                      className="input"
                      placeholder="123"
                      value={fields.cardCvv}
                      onChange={(e) => setFields({ ...fields, cardCvv: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {method === "net-banking" && (
              <div>
                <label className="label">Select bank</label>
                <select required className="input" value={fields.bank} onChange={(e) => setFields({ ...fields, bank: e.target.value })}>
                  <option value="">Choose your bank</option>
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Punjab National Bank</option>
                </select>
              </div>
            )}

            {method === "wallet" && (
              <div>
                <label className="label">Select wallet</label>
                <select required className="input" value={fields.wallet} onChange={(e) => setFields({ ...fields, wallet: e.target.value })}>
                  <option value="">Choose a wallet</option>
                  <option>Paytm</option>
                  <option>PhonePe Wallet</option>
                  <option>Amazon Pay</option>
                  <option>Mobikwik</option>
                </select>
              </div>
            )}

            <label className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
              <input
                type="checkbox"
                checked={simulateFailure}
                onChange={(e) => setSimulateFailure(e.target.checked)}
                className="accent-amber-600"
              />
              Simulate a failed payment (for demo/testing)
            </label>

            <button type="submit" disabled={processing} className="btn-primary w-full">
              {processing ? "Processing payment…" : `Pay ₹${booking.price}`}
            </button>
            <p className="text-center text-[11px] text-ink-400">
              This is a simulated payment for academic demo purposes — no real money is charged.
            </p>
          </form>

          <div className="card h-fit">
            <p className="text-xs font-semibold text-ink-400">Order summary</p>
            <p className="mt-2 font-bold text-ink-900">{booking.serviceName}</p>
            <p className="text-xs text-ink-400">
              {booking.date} · {booking.time}
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-4">
              <span className="text-sm text-ink-600">Amount payable</span>
              <span className="font-display text-lg font-bold text-violet-600">₹{booking.price}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
