import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { TIME_SLOTS, CATEGORIES } from "../../utils/constants";
import { getServiceById, getUserById, createBooking } from "../../utils/dataService";
import { useAuth } from "../../context/AuthContext";
import { useNotificationBus } from "../../context/NotificationContext";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function Booking() {
  const { serviceId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { bump } = useNotificationBus();
  const service = getServiceById(serviceId);
  const provider = service ? getUserById(service.providerId) : null;

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState(user?.address || "");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!service || !provider) {
    return (
      <Layout>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <p className="font-display text-xl font-bold text-ink-900">Service not found</p>
          <Link to="/services" className="btn-primary mt-4 inline-flex">
            Browse services
          </Link>
        </div>
      </Layout>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const booking = createBooking({ customer: user, service, provider, date, time, address, notes });
    bump();
    setTimeout(() => navigate(`/bookings?highlight=${booking.id}`), 300);
  }

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-8">
        <h1 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">Confirm your booking</h1>
        <p className="mt-1 text-sm text-ink-400">
          Your request will be sent to {provider.name} — you'll pay once it's accepted.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_280px]">
          <form onSubmit={handleSubmit} className="card space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Preferred date</label>
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
                <label className="label">Preferred time</label>
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
            <div>
              <label className="label">Service address</label>
              <textarea
                required
                rows={2}
                className="input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House no., street, area, city"
              />
            </div>
            <div>
              <label className="label">Notes for the provider (optional)</label>
              <textarea
                rows={3}
                className="input"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe the issue or any special instructions"
              />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? "Sending request…" : "Send Booking Request"}
            </button>
          </form>

          <div className="card h-fit">
            <p className="text-xs font-semibold text-ink-400">Booking summary</p>
            <p className="mt-2 font-bold text-ink-900">{service.name}</p>
            <p className="text-xs text-ink-400">
              {CATEGORIES.find((c) => c.slug === service.category)?.label} · {provider.name}
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-4">
              <span className="text-sm text-ink-600">Estimated price</span>
              <span className="font-display text-lg font-bold text-violet-600">
                ₹{service.price}/{service.priceUnit}
              </span>
            </div>
            <p className="mt-3 text-xs text-ink-400">
              Final amount may vary based on job scope. Payment is collected only after the
              provider accepts your request.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
