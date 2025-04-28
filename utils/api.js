// api.js

const BASE_URL = "http://localhost:4000/api"; // change to your real API base URL

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // enables sending cookies in CORS
});

// === Add auth token from localStorage/sessionStorage if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken"); // or sessionStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// === Handle responses or errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

// === API functions
export const get = (url, config = {}) =>
  apiClient.get(url, config).then((res) => res.data);

export const post = (url, data = {}, config = {}) =>
  apiClient.post(url, data, config).then((res) => res.data);

export const put = (url, data = {}, config = {}) =>
  apiClient.put(url, data, config).then((res) => res.data);

export const del = (url, config = {}) =>
  apiClient.delete(url, config).then((res) => res.data);

export const patch = (url, data = {}, config = {}) =>
  apiClient.patch(url, data, config).then((res) => res.data);

export { BASE_URL };
