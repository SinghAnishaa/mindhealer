import { useState, useContext } from "react";
import { login as loginAPI } from "../api/auth"; 
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            console.log("🔹 Attempting login with:", { email, password });

            const res = await loginAPI({ email, password });

            console.log("🚀 Login Response:", res);

            if (!res || !res.authToken) {
                throw new Error("❌ No authToken received from backend!");
            }

            console.log("🔹 Storing authToken in localStorage:", res.authToken);

            // ✅ Store authToken and user in localStorage with try-catch
            try {
                localStorage.setItem("authToken", res.authToken);
                localStorage.setItem("user", JSON.stringify(res.user));
            } catch (storageError) {
                throw new Error("❌ LocalStorage write failed! Possibly due to private browsing.");
            }

            // ✅ Verify if authToken was stored successfully
            const storedAuthToken = localStorage.getItem("authToken");
            const storedUser = localStorage.getItem("user");

            console.log("🔍 Checking stored authToken:", storedAuthToken);
            console.log("🔍 Checking stored user:", storedUser);

            if (!storedAuthToken || !storedUser) {
                throw new Error("❌ authToken storage failed!");
            }

            // ✅ Use AuthContext to update state
            if (typeof login === "function") {
                await login(res.user, res.authToken); // Ensure it’s awaited if async
            } else {
                console.warn("⚠️ AuthContext login function is not defined!");
            }

            console.log("✅ User authenticated successfully! Redirecting...");

            // ✅ Add slight delay to ensure localStorage updates before navigating
            setTimeout(() => navigate("/chat"), 500);
        } catch (err) {
            console.error("❌ Login Error:", err.message || err);
            alert("Authentication Failed: " + (err.message || "Unknown error"));
        }
    };          

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
