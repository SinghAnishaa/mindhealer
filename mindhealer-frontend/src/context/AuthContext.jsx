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
    const [loading, setLoading] = useState(true);

    // ✅ Function to fetch a new access token
    const refreshAccessToken = async () => {
        try {
            console.log("🔄 Refreshing access token...");
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh-token`, {
                method: "POST",
                credentials: "include",  // 🔥 Ensures cookies are sent
            });
    
            const data = await response.json();
            if (response.ok && data.accessToken) {
                console.log("✅ New Access Token:", data.accessToken);
                localStorage.setItem("token", data.accessToken);
                setToken(data.accessToken);
                return data.accessToken;
            } else {
                console.error("❌ Failed to refresh access token", data);
                logout(); // If refresh fails, log out the user
            }
        } catch (error) {
            console.error("❌ Error refreshing token:", error);
            logout();
        }
    };
    
    
        

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            console.log("✅ Restoring session...");
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
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
            .catch(async (err) => {
                console.error("❌ Auth Check Failed:", err.response?.status);

                if (err.response?.status === 401) {
                    console.log("🔄 Attempting token refresh...");
                    const newToken = await refreshAccessToken();
                    
                    if (newToken) {
                        axios.get("http://localhost:5050/api/auth/user", {
                            headers: { Authorization: `Bearer ${newToken}` }
                        })
                        .then(res => {
                            console.log("✅ Successfully refreshed token and authenticated:", res.data);
                            setUser(res.data);
                        })
                        .catch(() => logout());
                    } else {
                        logout();
                    }
                }
            });
        }
    }, [token]);

    const login = async (userData, token) => {
        console.log("🔹 Saving token:", token);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
    
        setToken(token);
        setUser(userData);
    
        try {
            // ✅ Fetch new access token using refresh token
            const response = await fetch("http://localhost:5050/api/auth/refresh-token", {
                method: "POST",
                credentials: "include", // 🔥 Ensures cookies are sent
            });
    
            const data = await response.json();
            if (response.ok && data.accessToken) {
                console.log("✅ New Access Token Received:", data.accessToken);
                localStorage.setItem("token", data.accessToken);
                setToken(data.accessToken);
            } else {
                console.error("❌ Failed to refresh access token", data);
            }
        } catch (error) {
            console.error("❌ Error refreshing token:", error);
        }
    };
    
    

    const logout = () => {
        console.log("🔹 Logging out user");
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken("");
        setUser(null);

        axios.post("http://localhost:5050/api/auth/logout", {}, { withCredentials: true })
            .then(() => console.log("✅ Logged out from server"))
            .catch((err) => console.error("❌ Error during logout:", err));
    };

    return (
        <AuthContext.Provider value={{ user, setUser, token, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
