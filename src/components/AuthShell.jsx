import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function AuthShell({ title, subtitle, children, footer, side }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-connect-gradient p-10 text-white lg:flex">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <Link to="/" className="relative">
          <Logo light size="md" />
        </Link>
        <div className="relative max-w-sm">
          <p className="font-display text-3xl font-bold leading-snug">
            {side || "Trusted pros for every home service, just a tap away."}
          </p>
          <p className="mt-4 text-sm text-white/70">
            Book electricians, plumbers, cleaners and more — track every step from request to
            completion.
          </p>
        </div>
        <p className="relative text-xs text-white/50">© {new Date().getFullYear()} Connect</p>
      </div>

      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <Link to="/" className="mb-8 lg:hidden">
          <Logo size="md" />
        </Link>
        <div className="mx-auto w-full max-w-sm">
          <h1 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-ink-400">{subtitle}</p>}
          <div className="mt-7">{children}</div>
          {footer && <div className="mt-6 text-sm text-ink-600">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
