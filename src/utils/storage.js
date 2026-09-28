export const KEYS = {
  USERS: "connect_users",
  SESSION: "connect_session",
  SERVICES: "connect_services",
  BOOKINGS: "connect_bookings",
  REVIEWS: "connect_reviews",
  NOTIFICATIONS: "connect_notifications",
  SEEDED: "connect_seeded_v1",
};

export function readAll(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function writeAll(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function readOne(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeOne(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeKey(key) {
  localStorage.removeItem(key);
}

export function makeId(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export function nowISO() {
  return new Date().toISOString();
}
