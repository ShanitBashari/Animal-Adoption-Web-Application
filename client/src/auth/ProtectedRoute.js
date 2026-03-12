import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * Protects routes that require an authenticated user.
 * Redirects unauthenticated users to the login page.
 */
export function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user?.accessToken) return <Navigate to="/login" replace />;
  return children;
}

/**
 * Protects admin-only routes.
 * Redirects unauthenticated users to login
 * and non-admin users back to the home page.
 */
export function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user?.accessToken) return <Navigate to="/login" replace />;

  const roles = user?.roles || [];
  if (!roles.includes("ADMIN")) return <Navigate to="/" replace />;

  return children;
}