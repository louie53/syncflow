import axios from 'axios';

// 1. Create the Axios Instance
// read from environment variable
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Add Request Interceptor (拦截器)
// Automatically attach the JWT token to every request if it exists
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Add Response Interceptor (Optional but good for global error handling)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Global Error Handling (e.g., redirect to login on 401)
        if (error.response?.status === 401) {
            // Logic to redirect to login or clear token could go here
            console.warn('Unauthorized, token might be invalid');
        }
        return Promise.reject(error);
    }
);

export default apiClient;