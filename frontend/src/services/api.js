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
const API_DEBUG = import.meta.env.DEV || import.meta.env.VITE_DEBUG_API === 'true';

function debugLog(...args) {
  if (API_DEBUG) console.log(...args);
}

function debugError(...args) {
  if (API_DEBUG) console.error(...args);
}

function getToken() {
  return localStorage.getItem('token');
}

async function request(method, path, body = null) {
  const url = `${API_BASE}${path}`;
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const opts = { method, headers, cache: 'no-store' };
  if (body) {
    headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }

  debugLog('[API][REQUEST]', { method, url, hasToken: Boolean(token), body });

  const res = await fetch(url, opts);
  const contentType = res.headers.get('content-type') || '';

  debugLog('[API][RESPONSE]', { method, url, status: res.status, ok: res.ok, contentType });

  if (!contentType.includes('application/json')) {
    const responseText = await res.text();
    const preview = responseText.slice(0, 300);
    debugError('[API][INVALID_CONTENT_TYPE]', {
      method,
      url,
      status: res.status,
      contentType,
      preview,
    });
    const nonJsonMessage = res.status === 405
      ? 'API trả về 405 Method Not Allowed (thường do VITE_API_BASE_URL đang trỏ vào frontend static domain).'
      : 'API response is not JSON. Check VITE_API_BASE_URL and backend routing.';
    const error = new Error(nonJsonMessage);
    error.status = res.status;
    error.debug = { method, url, status: res.status, contentType, preview };
    throw error;
  }

  const data = await res.json();
  debugLog('[API][JSON]', { method, url, status: res.status, success: data?.success, message: data?.message });

  if (!res.ok || !data.success) {
    debugError('[API][FAILED]', { method, url, status: res.status, response: data });
    const error = new Error(data.message || 'Có lỗi xảy ra');
    error.status = res.status;
    error.debug = { method, url, status: res.status, response: data };
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
