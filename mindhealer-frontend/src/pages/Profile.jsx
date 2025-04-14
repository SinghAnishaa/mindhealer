import React, { useState, useEffect, useContext } from "react";
import { Container } from "../components/ui/container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { AuthContext } from "../context/AuthContext";
import { Camera, User, Mail, MapPin, Calendar } from "lucide-react";
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
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                bio: user.profile?.bio || "",
                age: user.profile?.age || "",
                location: user.profile?.location || "",
                profileImage: user.profile?.avatar ? `${import.meta.env.VITE_API_BASE_URL}${user.profile.avatar}` : "/default-avatar.png",
            });
        }
    }, [user]);

    const handleImageChange = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async () => {
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                alert("Authentication error. Please log in again.");
                return;
            }

            // First, handle image upload if there's a new image
            if (selectedFile) {
                const imageData = new FormData();
                imageData.append("profileImage", selectedFile);
                await axios.put(
                    `${import.meta.env.VITE_API_BASE_URL}/api/auth/upload-profile-image`,
                    imageData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            // Then update other profile information
            const res = await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/update-profile`,
                {
                    bio: formData.bio,
                    age: formData.age,
                    location: formData.location,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setUser(res.data.user);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Profile Update Error:", error);
            alert("Failed to update profile. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container className="py-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
                    <User className="h-8 w-8 text-blue-600" />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Update your personal information and profile picture</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {/* Profile Image Section */}
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative">
                                    <img
                                        src={previewUrl || formData.profileImage || "/default-avatar.png"}
                                        alt="Profile"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                                    />
                                    <label className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                                        <Camera className="h-5 w-5 text-white" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Click the camera icon to update your profile picture
                                </p>
                            </div>

                            {/* Profile Details Form */}
                            <div className="grid gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Mail className="w-4 h-4 inline-block mr-2" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={user?.email || ""}
                                        disabled
                                        className="input w-full bg-gray-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <User className="w-4 h-4 inline-block mr-2" />
                                        Bio
                                    </label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        placeholder="Tell us about yourself..."
                                        className="input w-full min-h-[100px]"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <Calendar className="w-4 h-4 inline-block mr-2" />
                                            Age
                                        </label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleChange}
                                            placeholder="Your age"
                                            className="input w-full"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <MapPin className="w-4 h-4 inline-block mr-2" />
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="Your location"
                                            className="input w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleUpdateProfile}
                                disabled={isSubmitting}
                                className="w-full"
                            >
                                {isSubmitting ? "Updating Profile..." : "Save Changes"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Container>
    );
};

export default Profile;
