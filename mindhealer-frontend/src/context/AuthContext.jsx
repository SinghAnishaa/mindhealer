// AuthContext.jsx

import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Create Auth Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || ""); // Changed `token` to `authToken`
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // ✅ Safely retrieve `authToken`
    const getAuthToken = () => {
        try {
            const storedToken = localStorage.getItem("authToken");
            return storedToken && storedToken !== "undefined" ? storedToken : null;
        } catch (error) {
            console.error("❌ Error accessing localStorage:", error);
            return null;
        }
    };

    // ✅ Sync `authToken` from localStorage into state
    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        if (storedToken && authToken !== storedToken) {
            console.log("✅ Syncing authToken from localStorage to context.");
            setAuthToken(storedToken);
        }
    }, [authToken]);

    // ✅ Restore session from localStorage
    useEffect(() => {
        setLoading(true);
        try {
            const storedToken = getAuthToken();
            const storedUser = localStorage.getItem("user");

            if (!storedToken || !storedUser) {
                console.warn("❌ No session found. Redirecting to login...");
                setAuthToken("");
                setUser(null);
                setLoading(false);
                navigate("/login");
                return;
            }

            setAuthToken(storedToken);
            setUser(JSON.parse(storedUser));

            axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/user`, {
                headers: { Authorization: `Bearer ${storedToken}` }
            })
            .then(res => {
                console.log("✅ Authenticated user:", res.data);
                setUser(res.data);
            })
            .catch(() => {
                console.error("❌ authToken verification failed. Logging out...");
                logout();
            })
            .finally(() => setLoading(false));

        } catch (error) {
            console.error("❌ Error restoring session:", error);
            setLoading(false);
        }
    }, []);

    // ✅ Login function to store `authToken` and user safely
    const login = async ({ user, authToken }) => {
        if (!authToken || !user) {
            console.error("❌ Invalid login data. No authToken or user.");
            return;
        }

        console.log("✅ Storing Auth Token:", authToken);
        try {
            localStorage.setItem("authToken", authToken);
            localStorage.setItem("user", JSON.stringify(user));
            setAuthToken(authToken);
            setUser(user);
            navigate('/dashboard');
        } catch (error) {
            console.error("❌ Error storing authToken in localStorage:", error);
        }
    };

    // ✅ Logout function to clear `authToken` and user
    const logout = async () => {
        console.log("🔹 Logging out user");

        try {
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            setAuthToken(""); // Ensure state is cleared
            setUser(null);
        } catch (error) {
            console.error("❌ Error clearing localStorage:", error);
        }

        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
            console.log("✅ Logged out from server");
        } catch (err) {
            console.error("❌ Error during logout:", err);
        }

        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, setUser, authToken, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
