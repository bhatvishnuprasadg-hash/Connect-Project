import { Link } from "react-router-dom";
import Logo from "./Logo";
import { CATEGORIES } from "../utils/constants";

export default function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4 md:px-8">
        <div>
          <Logo size="sm" />
          <p className="mt-3 max-w-xs text-sm text-ink-400">
            We help you to connect with a pro — trusted home service professionals,
            booked in minutes.
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold text-ink-900">Popular Services</p>
          <ul className="space-y-2 text-sm text-ink-400">
            {CATEGORIES.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link to={`/services?category=${c.slug}`} className="hover:text-violet-600">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold text-ink-900">For Professionals</p>
          <ul className="space-y-2 text-sm text-ink-400">
            <li>
              <Link to="/provider/register" className="hover:text-violet-600">
                Register as a Pro
              </Link>
            </li>
            <li>
              <Link to="/provider/login" className="hover:text-violet-600">
                Provider Login
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold text-ink-900">Company</p>
          <ul className="space-y-2 text-sm text-ink-400">
            <li>About Connect</li>
            <li>Trust &amp; Safety</li>
            <li>Help Centre</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-100 px-4 py-5 text-center text-xs text-ink-400">
        © {new Date().getFullYear()} Connect. Academic demo project — all data is stored locally in your browser.
      </div>
    </footer>
  );
}
