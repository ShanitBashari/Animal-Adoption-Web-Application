
const API_BASE = process.env.REACT_APP_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(url, opts = {}) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...getAuthHeaders(),
    ...(opts.headers || {}),
  };

  const res = await fetch(url, {...opts, headers });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw Object.assign(new Error(`HTTP ${res.status}: ${res.statusText}`), {
      status: res.status,
      body: text,
    });
  }

  if (res.status === 204) 
    return null;

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const text = await res.text().catch(() => "");
    throw Object.assign(new Error("Expected JSON but got non-JSON response"), { body: text });
  }

  return res.json();
}

// API helpers
export const AnimalsApi = {
  list: () => request(`${API_BASE}/api/animals`),
  get: (id) => request(`${API_BASE}/api/animals/${id}`),
  remove: (id) => request(`${API_BASE}/api/animals/${id}`, { method: "DELETE" }),
  create: (dto) => request(`${API_BASE}/api/animals`, { method: "POST", body: JSON.stringify(dto) }),
  update: (id, dto) => request(`${API_BASE}/api/animals/${id}`, { method: "PUT", body: JSON.stringify(dto) }),
  search: (q, category) => request(`${API_BASE}/api/animals/search?q=${encodeURIComponent(q||"")}&category=${encodeURIComponent(category||"")}`),
};

export const RequestApi = {
  create: (dto) => request(`${API_BASE}/api/requests`, { method: "POST", body: JSON.stringify(dto) }),
  find: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`${API_BASE}/api/requests${qs ? "?" + qs : ""}`);
  },
};

export default { AnimalsApi };