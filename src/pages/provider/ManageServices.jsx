import { useState } from "react";
import Layout from "../../components/Layout";
import EmptyState from "../../components/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { CATEGORIES } from "../../utils/constants";
import { getServicesByProvider, createService, updateService, deleteService } from "../../utils/dataService";

const EMPTY_FORM = {
  name: "",
  description: "",
  category: CATEGORIES[0].slug,
  price: "",
  priceUnit: "visit",
  availability: "",
  serviceArea: "",
};

export default function ManageServices() {
  const { user } = useAuth();
  const [services, setServices] = useState(() => getServicesByProvider(user.id));
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  function refresh() {
    setServices(getServicesByProvider(user.id));
  }

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(s) {
    setForm({
      name: s.name,
      description: s.description,
      category: s.category,
      price: s.price,
      priceUnit: s.priceUnit,
      availability: s.availability,
      serviceArea: s.serviceArea,
    });
    setEditingId(s.id);
    setShowForm(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price) };
    if (editingId) {
      updateService(editingId, payload);
    } else {
      createService({ providerId: user.id, ...payload });
    }
    refresh();
    setShowForm(false);
  }

  function handleDelete(id) {
    if (!confirm("Delete this service listing?")) return;
    deleteService(id);
    refresh();
  }

  function toggleActive(s) {
    updateService(s.id, { active: !s.active });
    refresh();
  }

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">My Listings</h1>
            <p className="mt-1 text-sm text-ink-400">Create and manage the services you offer.</p>
          </div>
          <button onClick={openCreate} className="btn-primary">
            + Add Service
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="card mt-6 space-y-4">
            <p className="font-display text-lg font-bold text-ink-900">
              {editingId ? "Edit service" : "New service"}
            </p>
            <div>
              <label className="label">Service name</label>
              <input
                required
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Switchboard & Wiring Repair"
              />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                required
                rows={3}
                className="input"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="What does this service include?"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Category</label>
                <select
                  className="input"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="label">Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    className="input"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Per</label>
                  <input
                    required
                    className="input"
                    value={form.priceUnit}
                    onChange={(e) => setForm({ ...form, priceUnit: e.target.value })}
                    placeholder="visit"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Availability</label>
                <input
                  required
                  className="input"
                  value={form.availability}
                  onChange={(e) => setForm({ ...form, availability: e.target.value })}
                  placeholder="Mon–Sat, 9 AM – 7 PM"
                />
              </div>
              <div>
                <label className="label">Service area</label>
                <input
                  required
                  className="input"
                  value={form.serviceArea}
                  onChange={(e) => setForm({ ...form, serviceArea: e.target.value })}
                  placeholder="Koramangala, HSR Layout"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex-1">
                {editingId ? "Save Changes" : "Create Service"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="mt-6">
          {services.length === 0 && !showForm ? (
            <EmptyState
              icon="🧰"
              title="No services listed yet"
              subtitle="Add your first service so customers can find and book you."
              action={
                <button onClick={openCreate} className="btn-primary">
                  + Add Service
                </button>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {services.map((s) => (
                <div key={s.id} className="card">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-ink-900">{s.name}</p>
                      <p className="text-xs text-ink-400">
                        {CATEGORIES.find((c) => c.slug === s.category)?.label}
                      </p>
                    </div>
                    <span className={`chip ${s.active ? "bg-emerald-100 text-emerald-700" : "bg-ink-200 text-ink-600"}`}>
                      {s.active ? "Active" : "Paused"}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-ink-600">{s.description}</p>
                  <p className="mt-3 font-display font-bold text-violet-600">
                    ₹{s.price}
                    <span className="text-xs font-normal text-ink-400">/{s.priceUnit}</span>
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-ink-100 pt-3">
                    <button onClick={() => openEdit(s)} className="btn-ghost !px-3 !py-1.5 text-xs">
                      Edit
                    </button>
                    <button onClick={() => toggleActive(s)} className="btn-ghost !px-3 !py-1.5 text-xs">
                      {s.active ? "Pause" : "Activate"}
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="btn-danger !px-3 !py-1.5 text-xs">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
