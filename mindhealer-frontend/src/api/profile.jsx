import axios from 'axios';

const API_URL = "http://localhost:5050/api/profile";

// Get User Profile
export const getProfile = async (token) => {
    try {
        const response = await axios.get(API_URL, {
            headers: { Authorization: token }
        });
        return response.data;
    } catch (error) {
        console.error("Profile Fetch Error:", error.response.data);
        throw error.response.data;
    }
};

// Update Profile
export const updateProfile = async (token, profileData) => {
    try {
        const response = await axios.put(`${API_URL}/update`, profileData, {
            headers: { Authorization: token }
        });
        return response.data;
    } catch (error) {
        console.error("Profile Update Error:", error.response.data);
        throw error.response.data;
    }
};
