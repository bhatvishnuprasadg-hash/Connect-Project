import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "../../components/Layout";
import StarRating from "../../components/StarRating";
import EmptyState from "../../components/EmptyState";
import { CATEGORIES } from "../../utils/constants";
import { getServices, getUserById, getProviderRating } from "../../utils/dataService";

const SORTS = [
  { id: "rating", label: "Highest Rated" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
];

export default function ServiceListings() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "";
  const initialQuery = params.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("rating");

  const services = getServices().filter((s) => s.active);

  const enriched = useMemo(() => {
    return services
      .map((s) => {
        const provider = getUserById(s.providerId);
        const rating = getProviderRating(s.providerId);
        return { ...s, provider, rating };
      })
      .filter((s) => s.provider);
  }, [services]);

  const filtered = enriched
    .filter((s) => (category ? s.category === category : true))
    .filter((s) =>
      query
        ? `${s.name} ${s.description} ${s.provider.name}`.toLowerCase().includes(query.toLowerCase())
        : true
    )
    .filter((s) =>
      location
        ? `${s.serviceArea} ${s.provider.serviceArea || ""}`.toLowerCase().includes(location.toLowerCase())
        : true
    )
    .filter((s) => s.rating.avg >= minRating)
    .filter((s) => (maxPrice ? s.price <= Number(maxPrice) : true))
    .sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      return b.rating.avg - a.rating.avg;
    });

  function setCategory(slug) {
    const next = new URLSearchParams(params);
    if (slug) next.set("category", slug);
    else next.delete("category");
    setParams(next);
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <h1 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">
          Browse service professionals
        </h1>
        <p className="mt-1 text-sm text-ink-400">
          {filtered.length} service{filtered.length !== 1 && "s"} found
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Filters */}
          <aside className="card h-fit space-y-5 lg:sticky lg:top-20">
            <div>
              <label className="label">Search</label>
              <input
                className="input"
                placeholder="Service or provider name"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.icon} {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Location / area</label>
              <input
                className="input"
                placeholder="e.g. Koramangala"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Minimum rating</label>
              <select className="input" value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
                <option value={0}>Any rating</option>
                <option value={3}>3★ &amp; up</option>
                <option value={4}>4★ &amp; up</option>
                <option value={4.5}>4.5★ &amp; up</option>
              </select>
            </div>
            <div>
              <label className="label">Max price (₹)</label>
              <input
                type="number"
                min="0"
                className="input"
                placeholder="No limit"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Sort by</label>
              <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="btn-ghost w-full"
              onClick={() => {
                setQuery("");
                setLocation("");
                setMinRating(0);
                setMaxPrice("");
                setCategory("");
              }}
            >
              Clear filters
            </button>
          </aside>

          {/* Results */}
          {filtered.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No matching services"
              subtitle="Try adjusting your filters or searching a different category."
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((s) => (
                <Link
                  to={`/services/${s.id}`}
                  key={s.id}
                  className="card flex flex-col transition hover:-translate-y-1 hover:shadow-pop"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-connect-gradient font-display font-bold text-white">
                      {s.provider.name[0]}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-bold text-ink-900">{s.provider.name}</p>
                      <p className="truncate text-xs text-ink-400">{s.provider.serviceArea}</p>
                    </div>
                  </div>
                  <p className="mt-3 font-semibold text-ink-900">{s.name}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-ink-500">{s.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <StarRating value={Math.round(s.rating.avg)} readOnly size="text-xs" />
                    <span className="text-xs text-ink-400">
                      {s.rating.avg || "New"} ({s.rating.count})
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-3">
                    <span className="text-xs font-semibold text-ink-400">
                      {CATEGORIES.find((c) => c.slug === s.category)?.label}
                    </span>
                    <span className="font-display font-bold text-violet-600">
                      ₹{s.price}
                      <span className="text-xs text-ink-400">/{s.priceUnit}</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
