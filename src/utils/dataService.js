import { KEYS, readAll, writeAll, makeId, nowISO } from "./storage";
import { BOOKING_STATUS } from "./constants";

/* ---------------- Users ---------------- */
export function getUsers() {
  return readAll(KEYS.USERS);
}
export function getUserById(id) {
  return getUsers().find((u) => u.id === id) || null;
}
export function updateUser(id, patch) {
  const users = getUsers().map((u) => (u.id === id ? { ...u, ...patch } : u));
  writeAll(KEYS.USERS, users);
  return users.find((u) => u.id === id);
}

/* ---------------- Services ---------------- */
export function getServices() {
  return readAll(KEYS.SERVICES);
}
export function getServiceById(id) {
  return getServices().find((s) => s.id === id) || null;
}
export function getServicesByProvider(providerId) {
  return getServices().filter((s) => s.providerId === providerId);
}
export function createService(data) {
  const services = getServices();
  const svc = {
    id: makeId("svc"),
    active: true,
    createdAt: nowISO(),
    ...data,
  };
  services.unshift(svc);
  writeAll(KEYS.SERVICES, services);
  return svc;
}
export function updateService(id, patch) {
  const services = getServices().map((s) => (s.id === id ? { ...s, ...patch } : s));
  writeAll(KEYS.SERVICES, services);
  return services.find((s) => s.id === id);
}
export function deleteService(id) {
  writeAll(KEYS.SERVICES, getServices().filter((s) => s.id !== id));
}

/* ---------------- Reviews & ratings ---------------- */
export function getReviews() {
  return readAll(KEYS.REVIEWS);
}
export function getReviewsByProvider(providerId) {
  return getReviews()
    .filter((r) => r.providerId === providerId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}
export function getProviderRating(providerId) {
  const reviews = getReviewsByProvider(providerId);
  if (reviews.length === 0) return { avg: 0, count: 0 };
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  return { avg: Math.round(avg * 10) / 10, count: reviews.length };
}
export function addReview({ bookingId, customerId, providerId, rating, comment }) {
  const reviews = getReviews();
  const review = {
    id: makeId("rev"),
    bookingId,
    customerId,
    providerId,
    rating,
    comment,
    createdAt: nowISO(),
  };
  reviews.unshift(review);
  writeAll(KEYS.REVIEWS, reviews);
  updateBooking(bookingId, { reviewed: true });
  notify({
    userId: providerId,
    role: "provider",
    type: "New Review",
    message: `You received a new ${rating}-star review.`,
    bookingId,
  });
  return review;
}

/* ---------------- Notifications ---------------- */
export function getNotifications(userId) {
  return readAll(KEYS.NOTIFICATIONS)
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}
export function notify({ userId, role, type, message, bookingId }) {
  const all = readAll(KEYS.NOTIFICATIONS);
  all.unshift({
    id: makeId("ntf"),
    userId,
    role,
    type,
    message,
    bookingId: bookingId || null,
    read: false,
    createdAt: nowISO(),
  });
  writeAll(KEYS.NOTIFICATIONS, all);
}
export function markNotificationRead(id) {
  const all = readAll(KEYS.NOTIFICATIONS).map((n) =>
    n.id === id ? { ...n, read: true } : n
  );
  writeAll(KEYS.NOTIFICATIONS, all);
}
export function markAllNotificationsRead(userId) {
  const all = readAll(KEYS.NOTIFICATIONS).map((n) =>
    n.userId === userId ? { ...n, read: true } : n
  );
  writeAll(KEYS.NOTIFICATIONS, all);
}

/* ---------------- Bookings ---------------- */
export function getBookings() {
  return readAll(KEYS.BOOKINGS);
}
export function getBookingById(id) {
  return getBookings().find((b) => b.id === id) || null;
}
export function getBookingsByCustomer(customerId) {
  return getBookings()
    .filter((b) => b.customerId === customerId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}
export function getBookingsByProvider(providerId) {
  return getBookings()
    .filter((b) => b.providerId === providerId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}
export function updateBooking(id, patch) {
  const bookings = getBookings().map((b) =>
    b.id === id ? { ...b, ...patch, updatedAt: nowISO() } : b
  );
  writeAll(KEYS.BOOKINGS, bookings);
  return bookings.find((b) => b.id === id);
}

export function createBooking({ customer, service, provider, date, time, address, notes }) {
  const bookings = getBookings();
  const booking = {
    id: makeId("bk"),
    customerId: customer.id,
    providerId: provider.id,
    serviceId: service.id,
    serviceName: service.name,
    category: service.category,
    date,
    time,
    address,
    notes: notes || "",
    price: service.price,
    status: BOOKING_STATUS.PENDING,
    createdAt: nowISO(),
    updatedAt: nowISO(),
    rescheduleHistory: [],
    cancellation: null,
    payment: null,
    reviewed: false,
  };
  bookings.unshift(booking);
  writeAll(KEYS.BOOKINGS, bookings);

  notify({
    userId: provider.id,
    role: "provider",
    type: "New Booking Request",
    message: `${customer.name} requested ${service.name} on ${date} at ${time}.`,
    bookingId: booking.id,
  });
  return booking;
}

export function acceptBooking(booking) {
  const updated = updateBooking(booking.id, { status: BOOKING_STATUS.PAYMENT_PENDING });
  notify({
    userId: booking.customerId,
    role: "customer",
    type: "Booking Accepted",
    message: `Your booking for ${booking.serviceName} was accepted. Please complete payment to confirm.`,
    bookingId: booking.id,
  });
  return updated;
}

export function rejectBooking(booking, reason) {
  const updated = updateBooking(booking.id, {
    status: BOOKING_STATUS.REJECTED,
    rejectionReason: reason || "",
  });
  notify({
    userId: booking.customerId,
    role: "customer",
    type: "Booking Rejected",
    message: `Your booking for ${booking.serviceName} was rejected by the provider.`,
    bookingId: booking.id,
  });
  return updated;
}

export function payForBooking(booking, { method, success }) {
  const payment = {
    status: success ? "Paid" : "Failed",
    method,
    transactionId: "TXN" + Math.floor(Math.random() * 1e9),
    amount: booking.price,
    date: nowISO(),
  };
  const updated = updateBooking(booking.id, {
    payment,
    status: success ? BOOKING_STATUS.CONFIRMED : BOOKING_STATUS.PAYMENT_PENDING,
  });
  if (success) {
    notify({
      userId: booking.customerId,
      role: "customer",
      type: "Payment Successful",
      message: `Payment of ₹${booking.price} for ${booking.serviceName} was successful. Booking confirmed.`,
      bookingId: booking.id,
    });
  }
  return updated;
}

export function startService(booking) {
  const updated = updateBooking(booking.id, { status: BOOKING_STATUS.IN_PROGRESS });
  notify({
    userId: booking.customerId,
    role: "customer",
    type: "Service Started",
    message: `Your ${booking.serviceName} service has started.`,
    bookingId: booking.id,
  });
  return updated;
}

export function completeService(booking) {
  const updated = updateBooking(booking.id, { status: BOOKING_STATUS.COMPLETED });
  notify({
    userId: booking.customerId,
    role: "customer",
    type: "Service Completed",
    message: `Your ${booking.serviceName} service is complete. Please leave a review!`,
    bookingId: booking.id,
  });
  return updated;
}

export function requestReschedule(booking, { date, time, requestedBy }) {
  const history = [...(booking.rescheduleHistory || [])];
  history.push({
    id: makeId("rsh"),
    previousDate: booking.date,
    previousTime: booking.time,
    previousStatus: booking.status,
    requestedDate: date,
    requestedTime: time,
    requestedBy,
    status: "Requested",
    createdAt: nowISO(),
  });
  const updated = updateBooking(booking.id, {
    status: BOOKING_STATUS.RESCHEDULE_REQUESTED,
    rescheduleHistory: history,
  });
  notify({
    userId: booking.providerId,
    role: "provider",
    type: "Reschedule Request",
    message: `${requestedBy} requested to reschedule ${booking.serviceName} to ${date} at ${time}.`,
    bookingId: booking.id,
  });
  return updated;
}

export function respondToReschedule(booking, approve) {
  const history = [...(booking.rescheduleHistory || [])];
  const last = history[history.length - 1];
  if (last) last.status = approve ? "Approved" : "Rejected";

  let patch;
  if (approve && last) {
    patch = {
      status: BOOKING_STATUS.RESCHEDULED,
      date: last.requestedDate,
      time: last.requestedTime,
      rescheduleHistory: history,
    };
  } else {
    patch = {
      status: last ? last.previousStatus : booking.status,
      rescheduleHistory: history,
    };
  }
  const updated = updateBooking(booking.id, patch);
  notify({
    userId: booking.customerId,
    role: "customer",
    type: "Booking Rescheduled",
    message: approve
      ? `Your ${booking.serviceName} booking was rescheduled to ${last?.requestedDate} at ${last?.requestedTime}.`
      : `Your reschedule request for ${booking.serviceName} was rejected.`,
    bookingId: booking.id,
  });
  return updated;
}

export function cancelBooking(booking, { reason, note, cancelledBy }) {
  const updated = updateBooking(booking.id, {
    status: BOOKING_STATUS.CANCELLED,
    cancellation: { reason, note: note || "", cancelledBy, date: nowISO() },
  });
  const otherPartyId =
    cancelledBy === "customer" ? booking.providerId : booking.customerId;
  const otherRole = cancelledBy === "customer" ? "provider" : "customer";
  notify({
    userId: otherPartyId,
    role: otherRole,
    type: "Booking Cancelled",
    message: `${booking.serviceName} booking on ${booking.date} was cancelled (${reason}).`,
    bookingId: booking.id,
  });
  return updated;
}

/* ---------------- Provider earnings ---------------- */
export function getProviderEarnings(providerId) {
  const bookings = getBookingsByProvider(providerId);
  const paid = bookings.filter((b) => b.payment?.status === "Paid");
  const totalEarnings = paid.reduce((sum, b) => sum + b.price, 0);
  const completed = bookings.filter((b) => b.status === BOOKING_STATUS.COMPLETED);
  const upcoming = bookings.filter((b) =>
    [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.RESCHEDULED].includes(b.status)
  );
  return { totalEarnings, paidCount: paid.length, completedCount: completed.length, upcomingCount: upcoming.length, bookings };
}
