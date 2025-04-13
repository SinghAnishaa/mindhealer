import { useState, useContext } from "react";
import { signup } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { Link } from "react-router-dom";

const Signup = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(""); // Clear error when user types
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long");
            setLoading(false);
            return;
        }

        try {
            const res = await signup({
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            // Use the login function from AuthContext to set up the session
            await login({ user: res.user, authToken: res.authToken });
            navigate("/dashboard");
        } catch (err) {
            console.error("Signup Error:", err);
            setError(err.message || "Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600 p-4">
            <Box className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <Typography variant="h4" className="text-center mb-6">
                    🌟 Join MindHealer
                </Typography>

                {error && (
                    <Alert severity="error" className="mb-4">
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSignup} className="space-y-4">
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        variant="outlined"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </Button>
                </form>

                <Typography className="text-center mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login here
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default Signup;
