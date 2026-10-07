import axios, { type AxiosInstance } from 'axios';


const apiClient: AxiosInstance = axios.create({
    //baseURL: "http://10.1.1.14:8000/",
    //import.meta.env.VITE_API_BASE_URL
    //baseURL: "http://localhost:8000",
    //baseURL: "http://10.1.0.226:8000/",
    baseURL: "http://127.0.0.1:8000/",
    headers: {
        'Content-Type': 'application/json', //APIrest common response json type
    },
});

// Interceptor para tokens (opcional pero común)
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined' && token !== 'null' && token !== 'session_active') {
        let bearerToken = token;
        try {
            const parsed = JSON.parse(token);
            if (parsed?.tokens?.access) {
                bearerToken = parsed.tokens.access;
            } else if (parsed?.token?.access) {
                bearerToken = parsed.token.access;
            } else if (parsed?.access) {
                bearerToken = parsed.access;
            }
        } catch (e) {
            // Token is a plain string
        }
        if (bearerToken && bearerToken !== 'undefined' && bearerToken !== 'null') {
            config.headers.Authorization = `Bearer ${bearerToken}`;
        }
    }
    return config;
});

apiClient.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            // token expired or invalid → force logout if not already on Login page
            if (window.location.pathname !== '/Login') {
                localStorage.clear();
                window.location.href = '/Login';
            }
        }
        return Promise.reject(err);
    }
);

{/*
This is a **request interceptor**.
An interceptor lets you modify every request before it is sent.
Here, before each request:
1. It reads a token from `localStorage`.
2. If a token exists, it adds an `Authorization` header.
3. The request continues with the modified config.

So every request made with can automatically include authentication: `apiClient`

*/}

export default apiClient;