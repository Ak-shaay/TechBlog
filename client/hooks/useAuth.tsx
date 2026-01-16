import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    user: any;
    token: string | null;
    login: (token: string, user: any) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    // Helper to decode JWT payload safely
    const decodeToken = (token: string | null) => {
        if (!token) return null;
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    // Session Expiration & Inactivity Logic
    useEffect(() => {
        if (!token) return;

        // 1. Token Expiration Check
        const payload = decodeToken(token);
        if (payload && payload.exp) {
            const expirationTime = payload.exp * 1000;
            const currentTime = Date.now();
            const timeUntilExpiry = expirationTime - currentTime;

            if (timeUntilExpiry <= 0) {
                logout();
            } else {
                const expiryTimer = setTimeout(() => {
                    logout();
                    alert('Your session has expired. Please login again.');
                }, timeUntilExpiry);
                return () => clearTimeout(expiryTimer);
            }
        }

        // 2. Inactivity Timer (30 minutes)
        const INACTIVITY_LIMIT = 30 * 60 * 1000;
        let inactivityTimer: NodeJS.Timeout;

        const resetInactivityTimer = () => {
            if (inactivityTimer) clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                logout();
                alert('You have been logged out due to inactivity.');
            }, INACTIVITY_LIMIT);
        };

        // Events to track activity
        const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
        events.forEach(event => document.addEventListener(event, resetInactivityTimer));

        // Initialize timer
        resetInactivityTimer();

        return () => {
            if (inactivityTimer) clearTimeout(inactivityTimer);
            events.forEach(event => document.removeEventListener(event, resetInactivityTimer));
        };
    }, [token]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (newToken: string, newUser: any) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
