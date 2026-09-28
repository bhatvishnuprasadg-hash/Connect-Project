import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthShell from "../../components/AuthShell";
import { useAuth } from "../../context/AuthContext";

export default function ForgotPassword() {
  const { role: roleParam } = useParams();
  const role = roleParam === "provider" ? "provider" : "customer";
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ email: "", newPassword: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleVerify(e) {
    e.preventDefault();
    setError("");
    setStep(2);
  }

  function handleReset(e) {
    e.preventDefault();
    setError("");
    if (form.newPassword.length < 6) return setError("Password must be at least 6 characters.");
    if (form.newPassword !== form.confirm) return setError("Passwords do not match.");
    const res = resetPassword({ role, email: form.email, newPassword: form.newPassword });
    if (!res.ok) return setError(res.error);
    setSuccess(true);
    setTimeout(() => navigate(role === "provider" ? "/provider/login" : "/login"), 1600);
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle={`For your ${role} account`}
      footer={
        <Link
          to={role === "provider" ? "/provider/login" : "/login"}
          className="font-bold text-violet-600 hover:underline"
        >
          ← Back to login
        </Link>
      }
    >
      {success ? (
        <div className="rounded-xl bg-emerald-50 px-4 py-6 text-center">
          <p className="text-3xl">✅</p>
          <p className="mt-2 font-semibold text-emerald-700">Password updated! Redirecting to login…</p>
        </div>
      ) : step === 1 ? (
        <form onSubmit={handleVerify} className="space-y-4">
          {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600">{error}</p>}
          <p className="text-sm text-ink-600">
            Enter the email linked to your account. For this demo, no email is actually sent —
            you'll set a new password directly.
          </p>
          <div>
            <label className="label">Email address</label>
            <input
              type="email"
              required
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Continue
          </button>
        </form>
      ) : (
        <form onSubmit={handleReset} className="space-y-4">
          {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600">{error}</p>}
          <div>
            <label className="label">New password</label>
            <input
              type="password"
              required
              className="input"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="label">Confirm new password</label>
            <input
              type="password"
              required
              className="input"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Update Password
          </button>
        </form>
      )}
    </AuthShell>
  );
}
