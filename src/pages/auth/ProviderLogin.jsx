import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../../components/AuthShell";
import { useAuth } from "../../context/AuthContext";
import { DEMO_ACCOUNTS } from "../../utils/seed";

export default function ProviderLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const res = login({ role: "provider", ...form });
    if (!res.ok) return setError(res.error);
    navigate(location.state?.from?.pathname || "/provider/dashboard", { replace: true });
  }

  function fillDemo() {
    setForm(DEMO_ACCOUNTS.provider);
  }

  return (
    <AuthShell
      title="Provider login"
      subtitle="Manage your listings, bookings and earnings."
      side="“Connect keeps my schedule full and my customers happy.”"
      footer={
        <>
          New professional?{" "}
          <Link to="/provider/register" className="font-bold text-violet-600 hover:underline">
            Register as a Pro
          </Link>
          <div className="mt-3 border-t border-ink-100 pt-3">
            Looking to book a service?{" "}
            <Link to="/login" className="font-bold text-violet-600 hover:underline">
              Customer login
            </Link>
          </div>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600">
            {error}
          </p>
        )}
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
        <div>
          <div className="flex items-center justify-between">
            <label className="label">Password</label>
            <Link to="/provider/forgot-password" className="text-xs font-semibold text-violet-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            required
            className="input"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
        </div>
        <button type="submit" className="btn-primary w-full">
          Log In
        </button>
        <button type="button" onClick={fillDemo} className="btn-ghost w-full">
          Use demo provider account
        </button>
      </form>
    </AuthShell>
  );
}
