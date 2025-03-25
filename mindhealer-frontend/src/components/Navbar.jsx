import React, { useState, useEffect, useContext } from "react";
import { AppBar, Toolbar, Typography, Box, Button, Modal, TextField, Avatar, Menu, MenuItem } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { login, signup } from "../api/auth";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser, logout } = useContext(AuthContext);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(false); // Track if it's login or signup
  const [formData, setFormData] = useState({ email: "", password: "", username: "" });

  // For Profile Dropdown
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle authentication (Login/Signup)
  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (isSignup) {
        res = await signup(formData);
      } else {
        res = await login({ email: formData.email, password: formData.password });
      }
      setUser(res.user);
      setIsAuthModalOpen(false);
      navigate("/dashboard"); // Redirect to dashboard after login/signup
    } catch (err) {
      alert(`Authentication Failed: ${err.message}`);
    }
  };

  // Open and Close Profile Menu
  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="fixed" className="custom-navbar">
        <Toolbar className="flex items-center w-full px-12 py-3">
          
          {/* Logo / App Name */}
          <Typography variant="h6" className="text-white font-bold tracking-wide mr-10">
            MindHealer&nbsp;
          </Typography>

          {/* Navigation Links */}
          <Box className="flex space-x-6">
            {[
              { name: "Home", path: "/" },
              { name: "Forum", path: "/forum" },
              { name: "Chat", path: "/chat" },
              { name: "Therapists", path: "/therapists" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative text-white text-lg font-medium transition-all duration-300
                ${location.pathname === item.path ? "border-b-4 border-white pb-1" : "hover:text-gray-300"}`}
              >
                {item.name}
              </Link>
            ))}
          </Box>

          {/* Push Login/Signup/Logout/Profile Button to the Right */}
          <Box className="ml-auto flex items-center space-x-4">
            {user ? (
              <>
                {/* Profile Dropdown */}
                <Box className="flex items-center space-x-2 cursor-pointer" onClick={handleProfileClick}>
                  <Avatar alt={user.username} src={user.profileImage || "/default-avatar.png"} />
                  <Typography variant="subtitle1" className="text-white font-medium">
                    Hello, {user.username}
                  </Typography>
                </Box>

                {/* Profile Menu */}
                <Menu anchorEl={anchorEl} open={openMenu} onClose={handleClose}>
                  <MenuItem onClick={() => { navigate("/profile"); handleClose(); }}>
                    View Profile
                  </MenuItem>
                  <MenuItem onClick={() => { logout(); handleClose(); }}>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button onClick={() => { setIsAuthModalOpen(true); setIsSignup(false); }} variant="contained" color="warning" className="mr-2">
                  Login
                </Button>
                <Button onClick={() => { setIsAuthModalOpen(true); setIsSignup(true); }} variant="contained" color="primary">
                  Signup
                </Button>
              </>
            )}
          </Box>

        </Toolbar>
      </AppBar>

      {/* Authentication Modal */}
      <Modal open={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)}>
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96">
          <Typography variant="h6" className="text-center mb-4">{isSignup ? "📝 Signup" : "🔑 Login"}</Typography>
          <form onSubmit={handleAuth} className="space-y-3">
            {isSignup && (
              <TextField fullWidth label="Username" name="username" onChange={handleChange} required />
            )}
            <TextField fullWidth label="Email" name="email" type="email" onChange={handleChange} required />
            <TextField fullWidth label="Password" name="password" type="password" onChange={handleChange} required />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {isSignup ? "Signup" : "Login"}
            </Button>
          </form>
          <Button onClick={() => setIsAuthModalOpen(false)} fullWidth className="mt-2 text-sm text-gray-500">
            Cancel
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default Navbar;
