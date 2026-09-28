import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    const loginPath = role === "provider" ? "/provider/login" : "/login";
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    const redirect = user.role === "provider" ? "/provider/dashboard" : "/dashboard";
    return <Navigate to={redirect} replace />;
  }

  return children;
}
