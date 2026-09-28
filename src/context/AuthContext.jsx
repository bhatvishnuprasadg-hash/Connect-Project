import { createContext, useContext, useEffect, useState } from "react";
import { KEYS, readAll, writeAll, readOne, writeOne, removeKey, makeId, nowISO } from "../utils/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = readOne(KEYS.SESSION);
    if (session?.userId) {
      const users = readAll(KEYS.USERS);
      const found = users.find((u) => u.id === session.userId);
      if (found) setUser(found);
    }
    setLoading(false);
  }, []);

  function register({ role, name, email, password, phone, ...rest }) {
    const users = readAll(KEYS.USERS);
    const exists = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.role === role
    );
    if (exists) {
      return { ok: false, error: "An account with this email already exists for this role." };
    }
    const newUser = {
      id: makeId(role === "provider" ? "p" : "u"),
      role,
      name,
      email,
      password,
      phone,
      avatar: "",
      createdAt: nowISO(),
      ...rest,
    };
    users.push(newUser);
    writeAll(KEYS.USERS, users);
    writeOne(KEYS.SESSION, { userId: newUser.id, role });
    setUser(newUser);
    return { ok: true, user: newUser };
  }

  function login({ role, email, password }) {
    const users = readAll(KEYS.USERS);
    const found = users.find(
      (u) =>
        u.role === role &&
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );
    if (!found) {
      return { ok: false, error: "Invalid email or password." };
    }
    writeOne(KEYS.SESSION, { userId: found.id, role });
    setUser(found);
    return { ok: true, user: found };
  }

  function logout() {
    removeKey(KEYS.SESSION);
    setUser(null);
  }

  function refreshUser() {
    if (!user) return;
    const users = readAll(KEYS.USERS);
    const found = users.find((u) => u.id === user.id);
    if (found) setUser(found);
  }

  function resetPassword({ role, email, newPassword }) {
    const users = readAll(KEYS.USERS);
    const idx = users.findIndex(
      (u) => u.role === role && u.email.toLowerCase() === email.toLowerCase()
    );
    if (idx === -1) return { ok: false, error: "No account found with this email." };
    users[idx] = { ...users[idx], password: newPassword };
    writeAll(KEYS.USERS, users);
    return { ok: true };
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, refreshUser, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
