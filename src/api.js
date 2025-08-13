// frontend/src/api.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

export const tokenStore = {
  get access() { return localStorage.getItem(ACCESS_KEY) || ""; },
  get refresh() { return localStorage.getItem(REFRESH_KEY) || ""; },
  set({ access, refresh }) {
    if (access !== undefined) localStorage.setItem(ACCESS_KEY, access);
    if (refresh !== undefined) localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// ---- Request: attach access token ----
api.interceptors.request.use((config) => {
  const access = tokenStore.access;
  if (access) config.headers.Authorization = `Bearer ${access}`;
  return config;
});

// ---- Response: refresh-on-401 with single-flight + queue ----
let isRefreshing = false;
let requestQueue = []; // { resolve, reject, config }

function subscribeTokenRefresh(cb) { requestQueue.push(cb); }
function onRrefreshed(newToken) {
  requestQueue.forEach((cb) => cb(newToken));
  requestQueue = [];
}

async function refreshAccess() {
  const refresh = tokenStore.refresh;
  if (!refresh) throw new Error("No refresh token");
  const res = await axios.post(`${API_URL}/api/token/refresh/`, { refresh }, {
    headers: { "Content-Type": "application/json" },
  });
  const { access } = res.data || {};
  if (!access) throw new Error("No access in refresh response");
  tokenStore.set({ access });
  return access;
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error;

    // If no response or not 401, just bubble up
    if (!response || response.status !== 401) {
      return Promise.reject(error);
    }

    // Avoid infinite loop by marking retried requests
    if (config._retry) {
      // Already retried once and still 401 → hard fail
      tokenStore.clear();
      return Promise.reject(error);
    }
    config._retry = true;

    // If a refresh is already happening, wait for it, then retry
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((newAccess) => {
          config.headers.Authorization = `Bearer ${newAccess}`;
          resolve(api(config));
        });
      });
    }

    // Start a refresh
    isRefreshing = true;
    try {
      const newAccess = await refreshAccess();
      isRefreshing = false;
      onRrefreshed(newAccess);

      // Update default header for subsequent requests
      api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;

      // Retry the original request with fresh token
      config.headers.Authorization = `Bearer ${newAccess}`;
      return api(config);
    } catch (e) {
      isRefreshing = false;
      requestQueue = [];
      tokenStore.clear(); // drop tokens so UI can redirect to /login
      return Promise.reject(e);
    }
  }
);

// ---- Helper auth calls ----
export async function login(username, password) {
  const { data } = await axios.post(`${API_URL}/api/token/`, { username, password }, {
    headers: { "Content-Type": "application/json" },
  });
  // Expect { access, refresh }
  tokenStore.set(data);
  api.defaults.headers.common.Authorization = `Bearer ${data.access}`;
  return data;
}

export function logout() {
  tokenStore.clear();
  delete api.defaults.headers.common.Authorization;
}
