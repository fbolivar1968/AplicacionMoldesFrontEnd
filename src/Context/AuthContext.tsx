import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../Hooks/Validators/User.js';
import { mapRoleToType } from '../Hooks/Validators/User.js';
import { AuthService } from '../Services/authService.js';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    error: string | null;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    // 3 days in milliseconds: 3 * 24 * 60 * 60 * 1000 = 259,200,000 ms
    const INACTIVITY_TIMEOUT_MS = 3 * 24 * 60 * 60 * 1000;

    const clearSession = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('last_activity');
        setToken(null);
        setUser(null);
    };

    const updateLastActivity = () => {
        if (localStorage.getItem('token')) {
            localStorage.setItem('last_activity', Date.now().toString());
        }
    };

    useEffect(() => {
        // Load initial session on mount and check expiration
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const lastActivityStr = localStorage.getItem('last_activity');
        const now = Date.now();

        if (storedToken && lastActivityStr) {
            const lastActivity = parseInt(lastActivityStr, 10);
            if (isNaN(lastActivity) || now - lastActivity > INACTIVITY_TIMEOUT_MS) {
                clearSession();
                setLoading(false);
                return;
            }
        }

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser) as User;
                parsedUser.user_type = mapRoleToType(parsedUser.user_type ?? parsedUser.role);
                setToken(storedToken || 'session_active');
                setUser(parsedUser);
                // Refresh activity on active load
                localStorage.setItem('last_activity', now.toString());
            } catch (err) {
                console.error("Failed to parse stored user session", err);
                clearSession();
            }
        } else if (storedToken) {
            clearSession();
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (!token) return;

        // Periodic timer every minute to check if 3 days have elapsed without activity
        const intervalId = setInterval(() => {
            const lastActivityStr = localStorage.getItem('last_activity');
            if (lastActivityStr) {
                const lastActivity = parseInt(lastActivityStr, 10);
                if (!isNaN(lastActivity) && Date.now() - lastActivity > INACTIVITY_TIMEOUT_MS) {
                    clearSession();
                }
            }
        }, 60 * 1000);

        // Update last activity on user interactions (throttled)
        let lastLogged = 0;
        const handleUserActivity = () => {
            const now = Date.now();
            // Throttle storage writes to at most once every 30 seconds
            if (now - lastLogged > 30 * 1000) {
                lastLogged = now;
                updateLastActivity();
            }
        };

        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        events.forEach((event) => window.addEventListener(event, handleUserActivity, { passive: true }));

        return () => {
            clearInterval(intervalId);
            events.forEach((event) => window.removeEventListener(event, handleUserActivity));
        };
    }, [token]);
    const login = async (us_User: string, us_Password: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await AuthService.login(us_User, us_Password);
            const receivedToken = response.access || (response as any).token || (response as any).key || (response as any).auth_token || 'session_active';
            const rawUser = response.usuario || (response as any).user || response;
            if (!rawUser || typeof rawUser !== 'object') {
                throw new Error("Respuesta de usuario inválida del servidor");
            }
            const rawUserType = rawUser.user_type ?? rawUser.tipo_usuario ?? rawUser.role ?? rawUser.tipo_usuario_nombre;
            const numericUserType = mapRoleToType(rawUserType);

            // Construct frontend User object, mapping its role to the numeric type 1, 2, or 3
            const mappedUser: User = {
                id: rawUser.id ?? 1,
                username: rawUser.username || rawUser.user || rawUser.nombre || us_User,
                role: typeof rawUser.role === 'string' ? rawUser.role : (rawUser.tipo_usuario_nombre || 'ADMIN'),
                user_type: numericUserType
            };
            // Persistir sesión con el token de acceso
            localStorage.setItem('token', receivedToken);
            localStorage.setItem('user', JSON.stringify(mappedUser));
            localStorage.setItem('last_activity', Date.now().toString());
            setToken(receivedToken);
            setUser(mappedUser);
        } catch (err: any) {
            console.error("Login failed", err);
            const errorMessage = err?.response?.data?.detail || err?.response?.data?.message || err?.message || err?.error || "Error de inicio de sesión";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };
    const logout = () => {
        AuthService.logout();
        clearSession();
        setError(null);
    };
    const isAuthenticated = !!token || !!user;
    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, logout, error }}>
            {children} {/*Represents any component that's  gonna use the provider */}
        </AuthContext.Provider>
    );
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}