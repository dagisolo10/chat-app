import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    withCredentials: true,
});

// Request interceptor to mark auth check requests
api.interceptors.request.use(
    (config) => {
        // Mark auth check requests so response interceptor knows to skip them
        if (config.url?.includes("/auth/get-prifile")) {
            config._skipAuthCheck = true;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Don't try to refresh token for auth endpoints or if already retried
        const isAuthEndpoint = originalRequest.url?.includes("/auth/");
        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint && !originalRequest._skipAuthCheck) {
            originalRequest._retry = true;

            try {
                await api.post("/auth/refresh-token", {}, { withCredentials: true });

                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed - clear retry flag and reject
                originalRequest._retry = false;
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export default api;
