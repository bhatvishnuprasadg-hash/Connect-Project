import { useState } from "react";
import Layout from "../../components/Layout";
import StarRating from "../../components/StarRating";
import { useAuth } from "../../context/AuthContext";
import { CATEGORIES } from "../../utils/constants";
import { updateUser, getProviderRating, getReviewsByProvider } from "../../utils/dataService";

export default function ProviderProfile() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone,
    category: user.category,
    serviceArea: user.serviceArea || "",
    experience: user.experience || 0,
    bio: user.bio || "",
  });
  const [certInput, setCertInput] = useState("");
  const [saved, setSaved] = useState(false);
  const rating = getProviderRating(user.id);
  const reviews = getReviewsByProvider(user.id);

  function persist(patch) {
    updateUser(user.id, patch);
    refreshUser();
  }

  function handleSave(e) {
    e.preventDefault();
    persist({ ...form, experience: Number(form.experience) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function addCertification() {
    if (!certInput.trim()) return;
    persist({ certifications: [...(user.certifications || []), certInput.trim()] });
    setCertInput("");
  }
  function removeCertification(idx) {
    persist({ certifications: user.certifications.filter((_, i) => i !== idx) });
  }

  function handlePortfolioUpload(e) {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        persist({ portfolio: [...(user.portfolio || []), reader.result] });
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }
  function removePortfolioItem(idx) {
    persist({ portfolio: user.portfolio.filter((_, i) => i !== idx) });
  }

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
        <h1 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">My Profile</h1>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-6">
            <form onSubmit={handleSave} className="card space-y-4">
              <div className="flex items-center gap-3">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-connect-gradient font-display text-xl font-bold text-white">
                  {user.name[0]}
                </span>
                <div>
                  <p className="font-bold text-ink-900">{user.name}</p>
                  <p className="text-xs text-ink-400">{user.email}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <StarRating value={Math.round(rating.avg)} readOnly size="text-xs" />
                    <span className="text-xs text-ink-400">
                      {rating.avg || "New"} ({rating.count})
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <label className="label">Full name</label>
                <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Phone</label>
                  <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <label className="label">Experience (yrs)</label>
                  <input
                    type="number"
                    min="0"
                    className="input"
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="label">Primary category</label>
                <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Service area</label>
                <input className="input" value={form.serviceArea} onChange={(e) => setForm({ ...form, serviceArea: e.target.value })} />
              </div>
              <div>
                <label className="label">Bio</label>
                <textarea rows={3} className="input" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
              </div>
              <button type="submit" className="btn-primary w-full">
                {saved ? "Saved ✓" : "Save Changes"}
              </button>
            </form>

            <div className="card">
              <p className="font-display text-lg font-bold text-ink-900">Certifications</p>
              <div className="mt-3 flex gap-2">
                <input
                  className="input"
                  value={certInput}
                  onChange={(e) => setCertInput(e.target.value)}
                  placeholder="e.g. Govt. Certified Plumber"
                />
                <button type="button" onClick={addCertification} className="btn-secondary shrink-0">
                  Add
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(user.certifications || []).map((c, i) => (
                  <span key={i} className="chip bg-sky-50 text-sky-600">
                    🎓 {c}
                    <button onClick={() => removeCertification(i)} className="ml-1 text-sky-400 hover:text-sky-700">
                      ✕
                    </button>
                  </span>
                ))}
                {(!user.certifications || user.certifications.length === 0) && (
                  <p className="text-sm text-ink-400">No certifications added yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <p className="font-display text-lg font-bold text-ink-900">Work samples / portfolio</p>
              <label className="mt-3 flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-ink-200 py-6 text-sm font-semibold text-ink-500 hover:border-violet-400 hover:text-violet-600">
                📷 Upload photos
                <input type="file" accept="image/*" multiple className="hidden" onChange={handlePortfolioUpload} />
              </label>
              {(user.portfolio || []).length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {user.portfolio.map((src, i) => (
                    <div key={i} className="group relative aspect-square overflow-hidden rounded-lg">
                      <img src={src} alt={`Work sample ${i + 1}`} className="h-full w-full object-cover" />
                      <button
                        onClick={() => removePortfolioItem(i)}
                        className="absolute right-1 top-1 hidden h-6 w-6 place-items-center rounded-full bg-black/60 text-xs text-white group-hover:grid"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card">
              <p className="font-display text-lg font-bold text-ink-900">Reviews ({reviews.length})</p>
              {reviews.length === 0 ? (
                <p className="mt-3 text-sm text-ink-400">No reviews yet.</p>
              ) : (
                <div className="mt-3 space-y-4">
                  {reviews.map((r) => (
                    <div key={r.id} className="border-b border-ink-50 pb-3 last:border-0">
                      <div className="flex items-center justify-between">
                        <StarRating value={r.rating} readOnly size="text-xs" />
                        <span className="text-xs text-ink-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="mt-1 text-sm text-ink-600">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
