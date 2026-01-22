"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { contactService } from "@/services/contact.service";
import Loader from "@/components/ui/loader";

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: () => void;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = useCallback(async () => {
        try {
            const isLogged = await contactService.isLoggedIn();
            setIsAuthenticated(isLogged);
        } catch (error) {
            console.error("Auth check failed:", error);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = useCallback(() => {
        setIsAuthenticated(true);
    }, []);

    const logout = useCallback(async () => {
        try {
            await contactService.logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
        setIsAuthenticated(false);
    }, []);

    const contextValue = useMemo(() => ({
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkAuth
    }), [isAuthenticated, isLoading, login, logout, checkAuth]);

    return (
        <AuthContext.Provider value={contextValue}>
            {isLoading ? <Loader /> : children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
