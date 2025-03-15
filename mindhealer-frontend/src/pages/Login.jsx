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
    
            console.log("🚀 Login Response:", res);  // ✅ Debugging: Check the full response
    
            if (!res || !res.token) {
                throw new Error("❌ No token received from backend!");
            }
    
            console.log("🔹 Storing token in localStorage:", res.token);
    
            // ✅ Store token and user in localStorage (Changed "authToken" → "token")
            localStorage.setItem("token", res.token);
            localStorage.setItem("user", JSON.stringify(res.user));
    
            // ✅ Verify if token was stored successfully
            const storedToken = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");
    
            console.log("🔍 Checking stored token:", storedToken);
            console.log("🔍 Checking stored user:", storedUser);
    
            if (!storedToken || !storedUser) {
                throw new Error("❌ Token storage failed!");
            }
    
            // ✅ Use AuthContext to update state
            await login(res.user, res.token);
    
            console.log("✅ User authenticated successfully! Redirecting...");
            
            // ✅ Add slight delay to ensure localStorage updates before navigating
            setTimeout(() => navigate("/chat"), 500);
        } catch (err) {
            console.error("❌ Login Error:", err.message);
            alert("Authentication Failed: " + err.message);
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
