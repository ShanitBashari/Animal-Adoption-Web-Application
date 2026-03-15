import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

function isExpired(user) {
  return Boolean(user?.expiresAt && Date.now() >= user.expiresAt);
}

/**
 * Protects routes that require an authenticated user.
 * Redirects unauthenticated or expired users to the login page.
 */
export function ProtectedRoute({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user?.accessToken) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(
          location.pathname + location.search
        )}`}
        replace
      />
    );
  }

  if (isExpired(user)) {
    logout(true);
    return null;
  }

  return children;
}

/**
 * Protects admin-only routes.
 * Redirects unauthenticated or expired users to login
 * and non-admin users back to the home page.
 */
export function AdminRoute({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user?.accessToken) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(
          location.pathname + location.search
        )}`}
        replace
      />
    );
  }

  if (isExpired(user)) {
    logout(true);
    return null;
  }

  const roles = user?.roles || [];
  if (!roles.includes("ADMIN")) {
    return <Navigate to="/" replace />;
  }

  return children;
}