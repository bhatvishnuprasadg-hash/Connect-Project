import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../../components/AuthShell";
import { useAuth } from "../../context/AuthContext";
import { DEMO_ACCOUNTS } from "../../utils/seed";

export default function UserLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const res = login({ role: "customer", ...form });
    if (!res.ok) return setError(res.error);
    navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
  }

  function fillDemo() {
    setForm(DEMO_ACCOUNTS.customer);
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to book and track your home services."
      side="“Booked an electrician in two minutes, tracked the whole job from my phone.”"
      footer={
        <>
          New to Connect?{" "}
          <Link to="/register" className="font-bold text-violet-600 hover:underline">
            Create an account
          </Link>
          <div className="mt-3 border-t border-ink-100 pt-3">
            Are you a service professional?{" "}
            <Link to="/provider/login" className="font-bold text-violet-600 hover:underline">
              Provider login
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
            <Link to="/forgot-password" className="text-xs font-semibold text-violet-600 hover:underline">
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
          Use demo customer account
        </button>
      </form>
    </AuthShell>
  );
}
