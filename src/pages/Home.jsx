import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Layout from "../components/Layout";
import StarRating from "../components/StarRating";
import { CATEGORIES } from "../utils/constants";
import { getUsers, getProviderRating, getServicesByProvider } from "../utils/dataService";

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const providers = getUsers()
    .filter((u) => u.role === "provider")
    .map((p) => ({ ...p, rating: getProviderRating(p.id), services: getServicesByProvider(p.id) }))
    .sort((a, b) => b.rating.avg - a.rating.avg)
    .slice(0, 3);

  function handleSearch(e) {
    e.preventDefault();
    navigate(query ? `/services?q=${encodeURIComponent(query)}` : "/services");
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-connect-gradient">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
          <p className="chip bg-white/15 text-gold-200">Verified local professionals</p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-extrabold leading-tight text-white md:text-6xl">
            We help you to connect with a pro.
          </h1>
          <p className="mt-4 max-w-xl text-base text-white/80 md:text-lg">
            Electricians, plumbers, AC technicians, carpenters, painters, cleaners and more —
            search, book, and track your service, all in one place.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-8 flex max-w-xl flex-col gap-2 rounded-2xl bg-white p-2 shadow-pop sm:flex-row"
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What service do you need? e.g. AC repair"
              className="flex-1 rounded-xl border-0 bg-transparent px-4 py-3 text-sm text-ink-800 outline-none placeholder:text-ink-400"
            />
            <button type="submit" className="btn-primary justify-center px-6 py-3">
              Find a Pro
            </button>
          </form>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register" className="btn-secondary !border-white !text-white hover:!bg-white/10">
              Book a service
            </Link>
            <Link to="/provider/register" className="btn-ghost !text-white hover:!bg-white/10">
              Become a Connect Pro →
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <h2 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">
          Browse by category
        </h2>
        <p className="mt-1 text-sm text-ink-400">
          Pick a service to see vetted professionals near you.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to={`/services?category=${c.slug}`}
              className="card flex flex-col items-center gap-2 py-7 text-center transition hover:-translate-y-1 hover:shadow-pop"
            >
              <span className="text-3xl">{c.icon}</span>
              <span className="text-sm font-semibold text-ink-800">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-connect-gradient-soft py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">
            How Connect works
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { step: "1", title: "Tell us what you need", text: "Search by service, location and budget to shortlist trusted pros." },
              { step: "2", title: "Book a time that suits you", text: "Pick a date and slot — the pro accepts and you confirm with secure payment." },
              { step: "3", title: "Get it done, rate your pro", text: "Track your booking live, then leave a rating once the job is complete." },
            ].map((s) => (
              <div key={s.step} className="card">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-connect-gradient font-display text-base font-bold text-white">
                  {s.step}
                </span>
                <h3 className="mt-4 text-lg font-bold text-ink-900">{s.title}</h3>
                <p className="mt-1 text-sm text-ink-400">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured pros */}
      {providers.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <h2 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">
            Top-rated professionals
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {providers.map((p) => (
              <Link
                to={`/services/${p.services[0]?.id || ""}`}
                key={p.id}
                className="card transition hover:-translate-y-1 hover:shadow-pop"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-connect-gradient font-display text-lg font-bold text-white">
                    {p.name[0]}
                  </span>
                  <div>
                    <p className="font-bold text-ink-900">{p.name}</p>
                    <p className="text-xs capitalize text-ink-400">
                      {CATEGORIES.find((c) => c.slug === p.category)?.label}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <StarRating value={Math.round(p.rating.avg)} readOnly size="text-sm" />
                  <span className="text-xs text-ink-400">
                    {p.rating.avg || "New"} ({p.rating.count} reviews)
                  </span>
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-ink-600">{p.bio}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
        <div className="card flex flex-col items-center gap-4 bg-connect-gradient py-12 text-center text-white">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Are you a skilled professional?</h2>
          <p className="max-w-md text-sm text-white/80">
            Join Connect to find new customers, manage bookings, and grow your earnings.
          </p>
          <Link to="/provider/register" className="btn-secondary !border-white !bg-white !text-violet-600">
            Register as a Pro
          </Link>
        </div>
      </section>
    </Layout>
  );
}
