import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../../components/AuthShell";
import { useAuth } from "../../context/AuthContext";

export default function UserRegister() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    const { confirm, ...payload } = form;
    const res = register({ role: "customer", ...payload });
    if (!res.ok) return setError(res.error);
    navigate("/dashboard", { replace: true });
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Sign up to book trusted home service professionals."
      side="“From booking to feedback — everything in one tidy dashboard.”"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-violet-600 hover:underline">
            Log in
          </Link>
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
          <label className="label">Full name</label>
          <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Aanya Sharma" />
        </div>
        <div>
          <label className="label">Email address</label>
          <input type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
        </div>
        <div>
          <label className="label">Phone number</label>
          <input required className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="98765 00000" />
        </div>
        <div>
          <label className="label">Address</label>
          <input required className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="House no., street, city" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Password</label>
            <input type="password" required className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
          </div>
          <div>
            <label className="label">Confirm</label>
            <input type="password" required className="input" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} placeholder="••••••••" />
          </div>
        </div>
        <button type="submit" className="btn-primary w-full">
          Create Account
        </button>
      </form>
    </AuthShell>
  );
}
