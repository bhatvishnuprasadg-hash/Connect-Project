import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import StarRating from "../../components/StarRating";
import { CATEGORIES } from "../../utils/constants";
import {
  getServiceById,
  getUserById,
  getProviderRating,
  getReviewsByProvider,
  getServicesByProvider,
} from "../../utils/dataService";
import { useAuth } from "../../context/AuthContext";

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const service = getServiceById(id);

  if (!service) {
    return (
      <Layout>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <p className="font-display text-xl font-bold text-ink-900">Service not found</p>
          <Link to="/services" className="btn-primary mt-4 inline-flex">
            Browse services
          </Link>
        </div>
      </Layout>
    );
  }

  const provider = getUserById(service.providerId);
  const rating = getProviderRating(service.providerId);
  const reviews = getReviewsByProvider(service.providerId);
  const otherServices = getServicesByProvider(service.providerId).filter((s) => s.id !== service.id);

  function handleBook() {
    if (!user) return navigate("/login", { state: { from: { pathname: `/book/${service.id}` } } });
    navigate(`/book/${service.id}`);
  }

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
        <Link to="/services" className="text-sm font-semibold text-violet-600 hover:underline">
          ← Back to results
        </Link>

        <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="card">
              <span className="chip bg-violet-50 text-violet-600">
                {CATEGORIES.find((c) => c.slug === service.category)?.icon}{" "}
                {CATEGORIES.find((c) => c.slug === service.category)?.label}
              </span>
              <h1 className="mt-3 font-display text-2xl font-bold text-ink-900 md:text-3xl">
                {service.name}
              </h1>
              <p className="mt-2 text-sm text-ink-600">{service.description}</p>
              <div className="mt-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold text-ink-400">Price</p>
                  <p className="font-bold text-ink-900">
                    ₹{service.price}/{service.priceUnit}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink-400">Availability</p>
                  <p className="font-bold text-ink-900">{service.availability}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink-400">Service area</p>
                  <p className="font-bold text-ink-900">{service.serviceArea}</p>
                </div>
              </div>
            </div>

            <div className="card mt-6">
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-connect-gradient font-display text-xl font-bold text-white">
                  {provider.name[0]}
                </span>
                <div>
                  <p className="font-display text-lg font-bold text-ink-900">{provider.name}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <StarRating value={Math.round(rating.avg)} readOnly size="text-sm" />
                    <span className="text-xs text-ink-400">
                      {rating.avg || "New"} ({rating.count} reviews) · {provider.experience} yrs experience
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-ink-600">{provider.bio}</p>
              {provider.certifications?.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-ink-400">Certifications</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {provider.certifications.map((c, i) => (
                      <span key={i} className="chip bg-sky-50 text-sky-600">
                        🎓 {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {otherServices.length > 0 && (
                <div className="mt-5 border-t border-ink-100 pt-4">
                  <p className="mb-2 text-xs font-semibold text-ink-400">Other services by {provider.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {otherServices.map((s) => (
                      <Link key={s.id} to={`/services/${s.id}`} className="chip bg-ink-100 text-ink-700 hover:bg-ink-200">
                        {s.name} · ₹{s.price}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="card mt-6">
              <p className="font-display text-lg font-bold text-ink-900">
                Customer reviews ({reviews.length})
              </p>
              {reviews.length === 0 ? (
                <p className="mt-3 text-sm text-ink-400">No reviews yet — be the first to book and rate!</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {reviews.map((r) => (
                    <div key={r.id} className="border-b border-ink-50 pb-4 last:border-0">
                      <div className="flex items-center justify-between">
                        <StarRating value={r.rating} readOnly size="text-sm" />
                        <span className="text-xs text-ink-400">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm text-ink-600">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sticky booking card */}
          <div className="h-fit lg:sticky lg:top-20">
            <div className="card text-center">
              <p className="font-display text-2xl font-bold text-ink-900">
                ₹{service.price}
                <span className="text-sm font-normal text-ink-400">/{service.priceUnit}</span>
              </p>
              <p className="mt-1 text-xs text-ink-400">Pay securely after the provider accepts</p>
              <button onClick={handleBook} className="btn-primary mt-4 w-full">
                Book This Service
              </button>
              {!user && (
                <p className="mt-2 text-xs text-ink-400">
                  You'll be asked to log in or sign up first.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
