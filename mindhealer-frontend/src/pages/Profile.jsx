import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, TextField, Button, Avatar } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const Profile = () => {
    const { user, setUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        bio: "",
        age: "",
        location: "",
        profileImage: null,
    });
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                bio: user.profile?.bio || "",
                age: user.profile?.age || "",
                location: user.profile?.location || "",
                profileImage: user.profile?.avatar ? `http://localhost:5050${user.profile.avatar}` : "/default-avatar.png",
            });
        }
    }, [user]);

    // ✅ Helper function to safely retrieve authToken
    const getAuthToken = () => {
        try {
            const storedAuthToken = localStorage.getItem("authToken");
            if (!storedAuthToken || storedAuthToken === "undefined") {
                console.warn("❌ No valid authToken found.");
                return null;
            }
            return storedAuthToken;
        } catch (error) {
            console.error("❌ Error accessing localStorage:", error);
            return null;
        }
    };

    // Handle Input Changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Image Selection
    const handleImageChange = (e) => {
        if (e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    // ✅ Handle Profile Image Upload
    const handleImageUpload = async () => {
        if (!selectedFile) return alert("Please select an image.");

        const authToken = getAuthToken();
        if (!authToken) return alert("❌ Authentication error. Please log in again.");

        const imageData = new FormData();
        imageData.append("profileImage", selectedFile);

        try {
            const res = await axios.put(
                "http://localhost:5050/api/auth/update-profile",
                imageData,
                { headers: { Authorization: `Bearer ${authToken}` } } // ✅ Use authToken
            );
            setUser({ ...user, profile: { ...user.profile, avatar: res.data.user.profile.avatar } });
            alert("Profile image updated!");
        } catch (error) {
            console.error("❌ Image Upload Error:", error);
            alert("Failed to upload image.");
        }
    };

    // ✅ Handle Profile Update (Bio, Age, Location)
    const handleUpdateProfile = async () => {
        const authToken = getAuthToken();
        if (!authToken) return alert("❌ Authentication error. Please log in again.");

        try {
            const res = await axios.put("http://localhost:5050/api/auth/update-profile", formData, {
                headers: { Authorization: `Bearer ${authToken}` }, // ✅ Use authToken
            });
            setUser(res.data.user);
            alert("Profile Updated Successfully!");
        } catch (error) {
            console.error("Profile Update Error:", error);
        }
    };

    return (
        <Box className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <Typography variant="h5" className="mb-4 text-center font-semibold">
                👤 Edit Profile
            </Typography>

            {/* Profile Picture Upload */}
            <Box className="flex justify-center mb-4">
                <label htmlFor="upload-profile-pic">
                    <input
                        type="file"
                        id="upload-profile-pic"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                    />
                    <Avatar
                        src={formData.profileImage}
                        alt="Profile"
                        sx={{ width: 80, height: 80, cursor: "pointer" }}
                        onClick={handleImageUpload}
                    />
                </label>
            </Box>

            <TextField fullWidth label="Bio" name="bio" value={formData.bio} onChange={handleChange} className="mb-3" />
            <TextField fullWidth label="Age" name="age" type="number" value={formData.age} onChange={handleChange} className="mb-3" />
            <TextField fullWidth label="Location" name="location" value={formData.location} onChange={handleChange} className="mb-3" />

            <Button variant="contained" color="primary" fullWidth onClick={handleUpdateProfile}>
                UPDATE PROFILE
            </Button>
        </Box>
    );
};

export default Profile;
