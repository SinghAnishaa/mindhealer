import React, { useState } from "react";

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate authentication (Replace with actual backend logic later)
    if (email === "user@example.com" && password === "password") {
      onLogin(email);
      onClose();
    } else {
      alert("Invalid credentials! Try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold text-center mb-4">🔑 Login</h2>
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
