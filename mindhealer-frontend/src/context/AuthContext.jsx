import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

    const [token, setToken] = useState(localStorage.getItem("accessToken") || ""); // ✅ Use Correct Key
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // ✅ Restore user session from localStorage
    // Add loading state update
    // In authContext.jsx, modify the useEffect for token validation
    // Add loading state update
    useEffect(() => {
        setLoading(true); // Set loading initially
        
        if (!token) {
            console.warn("❌ No token found. Redirecting to login...");
            navigate("/login");
            setLoading(false); // Set loading to false when no token
            return;
        }

        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/user`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            console.log("✅ Authenticated user:", res.data);
            setUser(res.data);
            setLoading(false); // Set loading to false on success
        })
        .catch(() => {
            console.error("❌ Auth Check Failed. Logging out...");
            logout();
            setLoading(false); // Set loading to false on error
        });
    }, [token]);

    // ✅ Login function to store accessToken and user
    const login = async (userData, accessToken) => {
        if (!accessToken || !userData) {
            console.error("❌ Invalid login data. No accessToken or user.");
            return;
        }

        console.log("✅ Received Access Token:", accessToken);

        localStorage.setItem("accessToken", accessToken); // ✅ Use Correct Key
        localStorage.setItem("user", JSON.stringify(userData));

        setToken(accessToken);
        setUser(userData);

        console.log("✅ Token stored successfully:", localStorage.getItem("accessToken"));
    };

    // ✅ Logout function to clear token and user
    const logout = () => {
        console.log("🔹 Logging out user");
        localStorage.removeItem("accessToken"); // ✅ Use Correct Key
        localStorage.removeItem("user");

        setToken("");
        setUser(null);

        axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true })
            .then(() => console.log("✅ Logged out from server"))
            .catch((err) => console.error("❌ Error during logout:", err));

        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, setUser, token, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
