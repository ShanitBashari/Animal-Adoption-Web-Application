import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user?.accessToken) return <Navigate to="/login" replace />;
  return children;
}

export function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user?.accessToken) return <Navigate to="/login" replace />;

  const roles = user?.roles || [];
  if (!roles.includes("ADMIN")) return <Navigate to="/" replace />;

  return children;
}