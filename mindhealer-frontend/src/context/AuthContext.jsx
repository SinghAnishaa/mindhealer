import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create Auth Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user")) || null;
        } catch {
            return null;
        }
    });

    const [token, setToken] = useState(localStorage.getItem("token") || ""); // ✅ Changed "authToken" to "token"

    useEffect(() => {
        console.log("🔍 Checking stored token on mount:", token);
        console.log("🔍 Checking stored user on mount:", user);

        const storedToken = localStorage.getItem("token"); // ✅ Ensuring consistency
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            console.log("✅ Restoring session...");
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (token) {
            axios.get("http://localhost:5050/api/auth/user", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
                console.log("✅ Authenticated user:", res.data);
                setUser(res.data);
            })
            .catch(err => {
                console.error("❌ Auth Check Failed:", err.response?.status);
                if (err.response?.status === 401) {
                    logout();
                }
            });
        }
    }, [token]);

    const login = async (userData, authToken) => {
        try {
            console.log("🔹 Saving token:", authToken);
            localStorage.setItem("token", authToken); // ✅ Changed to "token"
            localStorage.setItem("user", JSON.stringify(userData));

            setToken(authToken);
            setUser(userData);
        } catch (error) {
            console.error("❌ Error during login:", error);
            throw error;
        }
    };

    const logout = () => {
        console.log("🔹 Logging out user");
        localStorage.removeItem("token"); // ✅ Ensure "token" is removed
        localStorage.removeItem("user");
        setToken("");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
