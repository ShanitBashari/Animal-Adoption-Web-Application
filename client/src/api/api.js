const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
const SESSION_DURATION_MS = 60 * 60 * 1000; // 60 minutes

/**
 * Reads full auth object from localStorage.
 */
function getAuth() {
  try {
    const raw = localStorage.getItem("auth");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Reads the saved access token from localStorage.
 */
function getToken() {
  const auth = getAuth();
  return auth?.accessToken || null;
}

/**
 * Returns true if session expiration time exists and has already passed.
 */
function isSessionExpired() {
  const auth = getAuth();
  const expiresAt = auth?.expiresAt;

  return Boolean(expiresAt && Date.now() >= expiresAt);
}

/**
 * Clears auth data and redirects user to login.
 */
function forceLogout() {
  localStorage.removeItem("auth");

  const currentPath = window.location.pathname + window.location.search;
  const target = `/login?expired=1&redirect=${encodeURIComponent(currentPath)}`;

  if (window.location.pathname !== "/login") {
    window.location.href = target;
  }
}

/**
 * Normalizes API responses:
 * - parses JSON when available
 * - parses plain text otherwise
 * - redirects to login on 401
 * - throws a structured error for non-2xx responses
 */
async function handleResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  const body = isJson
    ? await response.json().catch(() => null)
    : await response.text().catch(() => null);

  if (!response.ok) {
    const msg =
      body && body.message
        ? body.message
        : typeof body === "string" && body.length
          ? body
          : response.statusText || `HTTP ${response.status}`;

    if (response.status === 401) {
      forceLogout();
    }

    const err = new Error(msg);
    err.status = response.status;
    err.body = body;
    throw err;
  }

  return body;
}

/**
 * Unified request helper:
 * - adds Authorization header automatically when auth is enabled
 * - sends JSON by default for plain objects
 * - supports FormData without manually setting Content-Type
 * - redirects to login when local session already expired
 */
async function request(
  path,
  {
    method = "GET",
    body,
    headers,
    auth = true
  } = {}
) {
  if (auth && isSessionExpired()) {
    forceLogout();
    throw new Error("Session expired");
  }

  const token = auth ? getToken() : null;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const finalHeaders = {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers || {})
  };

  if (body != null && !isFormData && !finalHeaders["Content-Type"]) {
    finalHeaders["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body:
      body == null
        ? undefined
        : isFormData
          ? body
          : JSON.stringify(body)
  });

  return handleResponse(res);
}

/* -------------------- Animals API -------------------- */

export const AnimalsApi = {
  /**
   * Fetches public animals, optionally filtered by query params.
   */
  list({ q, category } = {}) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);

    const suffix = params.toString() ? `?${params.toString()}` : "";
    return request(`/api/animals${suffix}`, { method: "GET" });
  },

  /**
   * Fetches the currently logged-in user's listings.
   */
  mine() {
    return request(`/api/animals/mine`, { method: "GET" });
  },

  /**
   * Fetches a single animal by id.
   */
  get(id) {
    return request(`/api/animals/${encodeURIComponent(id)}`, { method: "GET" });
  },

  /**
   * Creates an animal using a regular JSON payload.
   */
  create(data) {
    return request(`/api/animals`, { method: "POST", body: data });
  },

  /**
   * Creates an animal using multipart form data,
   * typically when an image file is included.
   */
  createMultipart(formData) {
    return request(`/api/animals`, { method: "POST", body: formData });
  },

  /**
   * Updates an animal using a regular JSON payload.
   */
  update(id, data) {
    return request(`/api/animals/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: data
    });
  },

  /**
   * Updates an animal using multipart form data.
   */
  updateMultipart(id, formData) {
    return request(`/api/animals/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: formData
    });
  },

  /**
   * Deletes an animal listing.
   */
  delete(id) {
    return request(`/api/animals/${encodeURIComponent(id)}`, { method: "DELETE" });
  },

  /**
   * Reactivates a previously inactive animal listing.
   */
  activate(id) {
    return request(`/api/animals/${encodeURIComponent(id)}/activate`, {
      method: "PUT"
    });
  }
};

/* -------------------- Requests API -------------------- */

export const RequestsApi = {
  /**
   * Fetches adoption requests with optional filtering by user or animal.
   * Keep only if still needed for admin/debug purposes.
   */
  async list(params = {}) {
    const query = new URLSearchParams();

    if (params.userId != null) query.append("userId", params.userId);
    if (params.animalId != null) query.append("animalId", params.animalId);

    const qs = query.toString();
    return request(`/api/requests${qs ? `?${qs}` : ""}`);
  },

  /**
   * Fetches adoption requests created by the authenticated user.
   */
  async mine() {
    return request(`/api/requests/mine`, {
      method: "GET"
    });
  },

  /**
   * Fetches adoption requests received on animals owned by the authenticated user.
   */
  async received() {
    return request(`/api/requests/received`, {
      method: "GET"
    });
  },

  /**
   * Fetches a single adoption request by id.
   */
  async getById(id) {
    return request(`/api/requests/${id}`);
  },

  /**
   * Creates a new adoption request.
   */
  async create(payload) {
    return request(`/api/requests`, {
      method: "POST",
      body: payload
    });
  },

  /**
   * Cancels an existing adoption request.
   */
  async cancel(id) {
    return request(`/api/requests/${id}`, {
      method: "DELETE"
    });
  },

  /**
   * Approves an adoption request.
   */
  async approve(id) {
    return request(`/api/requests/${id}/approve`, {
      method: "POST"
    });
  },

  /**
   * Rejects an adoption request with an optional reason.
   */
  async reject(id, reason) {
    return request(`/api/requests/${id}/reject`, {
      method: "POST",
      body: { reason }
    });
  }
};

/* -------------------- Categories API -------------------- */

export const CategoriesApi = {
  /**
   * Fetches active categories for public dropdowns.
   */
  listActive: () => request(`/api/categories`),

  /**
   * Fetches all categories for admin management.
   */
  adminList: () => request(`/api/admin/categories`),

  /**
   * Creates a new category.
   */
  create: (payload) =>
    request(`/api/admin/categories`, {
      method: "POST",
      body: payload
    }),

  /**
   * Marks a category as inactive.
   */
  deactivate: (id) =>
    request(`/api/admin/categories/${id}/deactivate`, {
      method: "PATCH"
    }),

  /**
   * Restores a previously inactive category.
   */
  reactivate: (id) =>
    request(`/api/admin/categories/${id}/reactivate`, {
      method: "PATCH"
    })
};

/* -------------------- Auth API -------------------- */

export const AuthApi = {
  /**
   * Registers a new user.
   * Auth header is disabled because this endpoint is public.
   */
  register(payload) {
    return request(`/api/auth/register`, {
      method: "POST",
      body: payload,
      auth: false
    });
  },

  /**
   * Logs in a user and returns token-based auth data.
   * Auth header is disabled because this endpoint is public.
   */
  login(payload) {
    return request(`/api/auth/login`, {
      method: "POST",
      body: payload,
      auth: false
    });
  }
};

/* -------------------- Admin API -------------------- */

export const AdminApi = {
  /**
   * Fetches all users for admin management.
   */
  users() {
    return request(`/api/admin/users`, { method: "GET" });
  },

  /**
   * Fetches all animals for admin review.
   */
  animals() {
    return request(`/api/admin/animals`, { method: "GET" });
  },

  /**
   * Fetches all adoption requests for admin review.
   */
  requests() {
    return request(`/api/requests`, { method: "GET" });
  },

  /**
   * Deactivates a user account.
   */
  deactivateUser(id) {
    return request(`/api/admin/users/${encodeURIComponent(id)}/deactivate`, {
      method: "PATCH"
    });
  },

  /**
   * Reactivates a user account.
   */
  activateUser(id) {
    return request(`/api/admin/users/${encodeURIComponent(id)}/activate`, {
      method: "PATCH"
    });
  },

  /**
   * Removes an animal as an admin action.
   */
  removeAnimal(id) {
    return request(`/api/admin/animals/${encodeURIComponent(id)}`, {
      method: "DELETE"
    });
  },

  /**
   * Approves a pending animal listing.
   */
  approveAnimal: (animalId) =>
    request(`/api/admin/animals/${animalId}/approve`, {
      method: "PUT"
    }),

  /**
   * Rejects a pending animal listing with an optional reason.
   */
  rejectAnimal: (animalId, reason = "") =>
    request(`/api/admin/animals/${animalId}/reject`, {
      method: "PUT",
      body: { reason }
    })
};