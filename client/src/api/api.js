const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

function getToken() {
  try {
    const raw = localStorage.getItem("auth");
    const auth = raw ? JSON.parse(raw) : null;
    return auth?.accessToken || null;
  } catch {
    return null;
  }
}

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

    const err = new Error(msg);
    err.status = response.status;
    err.body = body;
    throw err;
  }

  return body;
}

/**
 * Unified request helper:
 * - Adds Authorization header automatically (if token exists)
 * - Sets JSON headers automatically when body is a plain object
 * - Supports FormData (does NOT set Content-Type so browser adds boundary)
 */
async function request(
  path,
  {
    method = "GET",
    body,
    headers,
    auth = true, // allow disabling auth header per request if needed
  } = {}
) {
  const token = auth ? getToken() : null;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const finalHeaders = {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers || {}),
  };

  // If it's JSON body and caller didn't explicitly set content-type
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
          : JSON.stringify(body),
  });

  return handleResponse(res);
}

/* -------------------- APIs -------------------- */

export const AnimalsApi = {
  list({ q, category } = {}) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);

    const suffix = params.toString() ? `?${params.toString()}` : "";
    return request(`/api/animals${suffix}`, { method: "GET" });
  },

  mine() {
    return request(`/api/animals/mine`, { method: "GET" });
  },

  get(id) {
    return request(`/api/animals/${encodeURIComponent(id)}`, { method: "GET" });
  },

  create(data) {
    return request(`/api/animals`, { method: "POST", body: data });
  },

  createMultipart(formData) {
    return request(`/api/animals`, { method: "POST", body: formData });
  },

  update(id, data) {
    return request(`/api/animals/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: data,
    });
  },

  updateMultipart(id, formData) {
    return request(`/api/animals/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: formData
    });
  },

  delete(id) {
    return request(`/api/animals/${encodeURIComponent(id)}`, { method: "DELETE" });
  },

  activate(id) {
    return request(`/api/animals/${encodeURIComponent(id)}/activate`, {
      method: "PUT",
    });
  },

};

export const RequestsApi = {
  async list(params = {}) {
    const query = new URLSearchParams();

    if (params.userId != null) query.append("userId", params.userId);
    if (params.animalId != null) query.append("animalId", params.animalId);

    const qs = query.toString();
    return request(`/api/requests${qs ? `?${qs}` : ""}`);
  },

  async getById(id) {
    return request(`/api/requests/${id}`);
  },

  async create(payload) {
    return request(`/api/requests`, {
      method: "POST",
      body: payload,
    });
  },

  async cancel(id) {
    return request(`/api/requests/${id}`, {
      method: "DELETE",
    });
  },

  async approve(id) {
    return request(`/api/requests/${id}/approve`, {
      method: "POST",
    });
  },

  async reject(id, reason) {
    return request(`/api/requests/${id}/reject`, {
      method: "POST",
      body: { reason },
    });
  },
};

export const CategoriesApi = {
  list() {
    return request(`/api/categories`, { method: "GET" });
  },

  get(id) {
    return request(`/api/categories/${encodeURIComponent(id)}`, { method: "GET" });
  },

  create(dto) {
    return request(`/api/categories`, { method: "POST", body: dto });
  },

  update(id, dto) {
    return request(`/api/categories/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: dto,
    });
  },

  delete(id) {
    return request(`/api/categories/${encodeURIComponent(id)}`, { method: "DELETE" });
  },
};

export const AuthApi = {
  register(payload) {
    return request(`/api/auth/register`, { method: "POST", body: payload, auth: false });
  },

  login(payload) {
    return request(`/api/auth/login`, { method: "POST", body: payload, auth: false });
  },
};

export const AdminApi = {
  users() {
    return request(`/api/admin/users`, { method: "GET" });
  },

  animals() {
    return request(`/api/admin/animals`, { method: "GET" });
  },

  requests() {
    return request(`/api/requests`, { method: "GET" });
  },

  deactivateUser(id) {
    return request(`/api/admin/users/${encodeURIComponent(id)}/deactivate`, {
      method: "PATCH"
    });
  },

  activateUser(id) {
    return request(`/api/admin/users/${encodeURIComponent(id)}/activate`, {
      method: "PATCH"
    });
  },

  removeAnimal(id) {
    return request(`/api/admin/animals/${encodeURIComponent(id)}`, {
      method: "DELETE"
    });
  },

  approveAnimal: (animalId) =>
    request(`/api/admin/animals/${animalId}/approve`, {
      method: "PUT"
  }),

  rejectAnimal: (animalId, reason = "") =>
    request(`/api/admin/animals/${animalId}/reject`, {
      method: "PUT",
      body: JSON.stringify({ reason })
  })
};


