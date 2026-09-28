import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const customerLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/services", label: "Browse Services" },
    { to: "/bookings", label: "My Bookings" },
  ];
  const providerLinks = [
    { to: "/provider/dashboard", label: "Dashboard" },
    { to: "/provider/services", label: "My Listings" },
    { to: "/provider/bookings", label: "Requests" },
    { to: "/provider/earnings", label: "Earnings" },
  ];
  const links = !user ? [] : user.role === "provider" ? providerLinks : customerLinks;

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link to="/" onClick={() => setMobileOpen(false)}>
          <Logo size="md" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive ? "bg-violet-50 text-violet-600" : "text-ink-600 hover:bg-ink-100"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user && <NotificationBell />}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-ink-100 py-1 pl-1 pr-3 text-sm font-semibold text-ink-800 hover:bg-ink-50"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-connect-gradient text-xs font-bold text-white">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </span>
                <span className="hidden max-w-[120px] truncate sm:inline">{user.name}</span>
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 z-30 mt-2 w-48 overflow-hidden rounded-xl border border-ink-100 bg-white shadow-pop"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <Link
                    to={user.role === "provider" ? "/provider/profile" : "/profile"}
                    className="block px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2.5 text-left text-sm font-medium text-rose-600 hover:bg-rose-50"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/login" className="btn-ghost">
                Log In
              </Link>
              <Link to="/register" className="btn-primary">
                Get Started
              </Link>
            </div>
          )}
          <button
            className="grid h-9 w-9 place-items-center rounded-lg text-xl md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-ink-100 px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-100"
              >
                {l.label}
              </NavLink>
            ))}
            {!user && (
              <div className="mt-2 flex gap-2">
                <Link to="/login" className="btn-secondary flex-1" onClick={() => setMobileOpen(false)}>
                  Log In
                </Link>
                <Link to="/register" className="btn-primary flex-1" onClick={() => setMobileOpen(false)}>
                  Get Started
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
