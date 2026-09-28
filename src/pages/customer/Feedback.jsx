import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import StarRating from "../../components/StarRating";
import { getBookingById, getUserById, addReview } from "../../utils/dataService";
import { useAuth } from "../../context/AuthContext";

export default function Feedback() {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const booking = getBookingById(bookingId);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!booking || booking.customerId !== user.id) {
    return (
      <Layout>
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <p className="font-display text-xl font-bold text-ink-900">Booking not found</p>
          <Link to="/bookings" className="btn-primary mt-4 inline-flex">
            Back to my bookings
          </Link>
        </div>
      </Layout>
    );
  }

  const provider = getUserById(booking.providerId);

  if (booking.reviewed) {
    return (
      <Layout>
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <p className="text-3xl">⭐</p>
          <p className="mt-2 font-display text-xl font-bold text-ink-900">
            You've already reviewed this booking
          </p>
          <Link to="/bookings" className="btn-primary mt-4 inline-flex">
            Back to my bookings
          </Link>
        </div>
      </Layout>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (rating === 0) return setError("Please select a star rating.");
    setSubmitting(true);
    addReview({
      bookingId: booking.id,
      customerId: user.id,
      providerId: booking.providerId,
      rating,
      comment,
    });
    setTimeout(() => navigate(`/bookings?highlight=${booking.id}`), 300);
  }

  return (
    <Layout>
      <div className="mx-auto max-w-xl px-4 py-10 md:px-8">
        <h1 className="font-display text-2xl font-bold text-ink-900">Rate your service</h1>
        <p className="mt-1 text-sm text-ink-400">
          {booking.serviceName} with {provider?.name}
        </p>

        <form onSubmit={handleSubmit} className="card mt-6 space-y-6">
          {error && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600">{error}</p>
          )}
          <div className="text-center">
            <p className="label justify-center text-center">How was {provider?.name}'s service?</p>
            <StarRating value={rating} onChange={setRating} size="text-4xl" />
          </div>
          <div>
            <label className="label">Write a review (optional)</label>
            <textarea
              rows={4}
              className="input"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details about quality, punctuality, professionalism..."
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Submitting…" : "Submit Review"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
