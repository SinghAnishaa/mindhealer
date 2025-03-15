import axios from 'axios';

const API_URL = "http://localhost:5050/api/auth"; // Backend URL

// Signup Function
export const signup = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/signup`, userData);
        localStorage.setItem("user", JSON.stringify(response.data.user)); // Store user details
        return response.data;
    } catch (error) {
        console.error("Signup Error:", error.response.data);
        throw error.response.data;
    }
};


// Login Function
export const login = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, userData);
        localStorage.setItem("token", response.data.token); // Store token
        return response.data;
    } catch (error) {
        console.error("Login Error:", error.response.data);
        throw error.response.data;
    }
};
