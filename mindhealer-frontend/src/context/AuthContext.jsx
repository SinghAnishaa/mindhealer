import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if user is already logged in
        const token = localStorage.getItem("token");
        if (token) {
            axios.get("http://localhost:5050/api/auth/user", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => setUser(res.data))
            .catch(err => console.error("Auth Check Failed", err));
        }
    }, []);

    // Logout Function
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
