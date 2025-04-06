import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5050/api/auth/login", {
        email,
        password,
      });

      const { authToken, user } = res.data;

      // ✅ Save to localStorage
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Trigger parent login logic (optional)
      if (onLogin) onLogin(user);

      // ✅ Close modal
      onClose();

      // ✅ Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid credentials. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold text-center mb-4">🔑 Login</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            className="w-full p-2 border rounded-lg"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full p-2 border rounded-lg"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg">
            Login
          </button>
        </form>

        <button onClick={onClose} className="w-full mt-2 text-sm text-gray-500">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
