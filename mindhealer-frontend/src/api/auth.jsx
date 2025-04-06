// // making critical chatbot fixes

import axios from 'axios';

const API_URL = "http://localhost:5050/api/auth"; // Backend URL

// ✅ Signup Function with Token Storage Fix
export const signup = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/signup`, userData, { withCredentials: true });

        console.log("✅ Signup Response:", response.data); // ✅ Debugging line

        // ✅ Ensure authToken exists in response before storing
        if (!response.data.authToken) {
            throw new Error("authToken missing in response! Backend might not be returning it.");
        }

        // ✅ Store user details and correct token key
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("authToken", response.data.authToken);

        return response.data;
    } catch (error) {
        console.error("❌ Signup Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Signup failed. Please try again.");
    }
};

// ✅ Login Function with Correct Token Key
export const login = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, userData, { withCredentials: true });

        console.log("✅ Login Response:", response.data); // ✅ Debugging line

        // ✅ Ensure authToken exists in response before storing
        if (!response.data.authToken) {
            throw new Error("authToken missing in response! Backend might not be returning it.");
        }

        // ✅ Store correct token key in localStorage
        localStorage.setItem("authToken", response.data.authToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        return response.data;
    } catch (error) {
        console.error("❌ Login Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Login failed. Please try again.");
    }
};

export const getUser = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authToken found.");
  
      const response = await axios.get(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      return response.data;
    } catch (error) {
      console.error("❌ Get User Error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to fetch user.");
    }
  };
  
