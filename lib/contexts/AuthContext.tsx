"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { clearAuthCookies, getTokenCookie, getUserData } from "../cookies";
import { handleGetCurrentUser } from "../actions/user-action";
import { useRouter } from "next/navigation";

interface AuthContextProps {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    user: any;
    setUser: (user: any) => void;
    logout: () => Promise<void>;
    loading: boolean;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const checkAuth = async () => {
        setLoading(true);
        try {
            const token = await getTokenCookie();
            if (!token) {
                setIsAuthenticated(false);
                setUser(null);
                return;
            }
            setIsAuthenticated(true);

            // Try to get the freshest user details from the API (whoami)
            const result = await handleGetCurrentUser();
            if (result.success) {
                setUser(result.data);
            } else {
                // fall back to cached cookie data, e.g. if offline
                const cachedUser = await getUserData();
                setUser(cachedUser);
            }
        } catch (err) {
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const logout = async () => {
        try {
            await clearAuthCookies();
            setIsAuthenticated(false);
            setUser(null);
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, logout, loading, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};