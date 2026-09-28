import { useState } from "react";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";
import { updateUser, getBookingsByCustomer } from "../../utils/dataService";

export default function CustomerProfile() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, phone: user.phone, address: user.address || "" });
  const [saved, setSaved] = useState(false);

  const bookings = getBookingsByCustomer(user.id);
  const payments = bookings.filter((b) => b.payment).sort((a, b) => new Date(b.payment.date) - new Date(a.payment.date)).reverse();

  function handleSave(e) {
    e.preventDefault();
    updateUser(user.id, form);
    refreshUser();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-10 md:px-8">
        <h1 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">My Profile</h1>

        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_1.2fr]">
          <form onSubmit={handleSave} className="card h-fit space-y-4">
            <div className="flex items-center gap-3">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-connect-gradient font-display text-xl font-bold text-white">
                {user.name[0]}
              </span>
              <div>
                <p className="font-bold text-ink-900">{user.name}</p>
                <p className="text-xs text-ink-400">{user.email}</p>
              </div>
            </div>
            <div>
              <label className="label">Full name</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Phone number</label>
              <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="label">Address</label>
              <textarea
                rows={2}
                className="input"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              {saved ? "Saved ✓" : "Save Changes"}
            </button>
          </form>

          <div className="card h-fit">
            <p className="font-display text-lg font-bold text-ink-900">Payment history</p>
            {payments.length === 0 ? (
              <p className="mt-3 text-sm text-ink-400">No payments yet.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {payments.map((b) => (
                  <div key={b.id} className="flex items-center justify-between border-b border-ink-50 pb-3 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-ink-800">{b.serviceName}</p>
                      <p className="text-xs text-ink-400">
                        {b.payment.method} · {new Date(b.payment.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-ink-900">₹{b.payment.amount}</p>
                      <p
                        className={`text-xs font-semibold ${
                          b.payment.status === "Paid" ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {b.payment.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
