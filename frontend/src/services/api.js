const resolveApiBase = () => {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim();
  if (configured) {
    const normalized = configured.replace(/\/+$/, '');
    return /\/api$/i.test(normalized) ? normalized : `${normalized}/api`;
  }

  // Dev local fallback
  if (import.meta.env.DEV) return 'http://localhost:5000/api';

  // Production fallback: same origin backend
  return `${window.location.origin}/api`;
};

const API_BASE = resolveApiBase();

function getToken() {
  return localStorage.getItem('token');
}

async function request(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const opts = { method, headers, cache: 'no-store' };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${path}`, opts);
  const contentType = res.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    const error = new Error('API response is not JSON. Check VITE_API_BASE_URL and backend routing.');
    error.status = res.status;
    throw error;
  }

  const data = await res.json();

  if (!res.ok || !data.success) {
    const error = new Error(data.message || 'Có lỗi xảy ra');
    error.status = res.status;
    throw error;
  }

  return data.data;
}

const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  patch: (path, body) => request('PATCH', path, body),
  delete: (path) => request('DELETE', path),
};

export default api;
