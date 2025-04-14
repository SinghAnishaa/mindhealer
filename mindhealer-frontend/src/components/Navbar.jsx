import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { login, signup } from "../api/auth";
import { cn } from "../utils/ui";
import { Home, MessageCircle, Users, Heart } from "lucide-react";
import { AppBar, Box, Modal, TextField, Button, Avatar, Menu, MenuItem } from "@mui/material";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser, logout } = useContext(AuthContext);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", username: "" });
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Forum", path: "/forum", icon: Users },
    { name: "Chat", path: "/chat", icon: MessageCircle },
    { name: "Therapists", path: "/therapists", icon: Heart },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
      navigate("/dashboard");
    } catch (err) {
      alert(`Authentication Failed: ${err.message}`);
    }
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-blue-600 p-1">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <Link to="/" className="text-xl font-bold">
              MindHealer
            </Link>
          </div>

          <nav className="hidden md:flex">
            <ul className="flex space-x-4">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium transition-colors hover:text-blue-600",
                      location.pathname === item.path
                        ? "text-blue-600"
                        : "text-gray-600"
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            {user ? (
              <>
                <Box className="flex items-center space-x-2 cursor-pointer" onClick={handleProfileClick}>
                  <Avatar alt={user.username} src={user.profileImage || "/default-avatar.png"} />
                  <span className="text-sm font-medium hidden sm:inline">
                    Hello, {user.username}
                  </span>
                </Box>

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
                <Button
                  variant="outlined"
                  onClick={() => { setIsAuthModalOpen(true); setIsSignup(false); }}
                  className="mr-2 hidden sm:inline-flex"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => { setIsAuthModalOpen(true); setIsSignup(true); }}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Join Now
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background/80 backdrop-blur-sm md:hidden">
        <div className="grid grid-cols-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center py-3 text-xs font-medium",
                location.pathname === item.path
                  ? "text-blue-600"
                  : "text-gray-600"
              )}
            >
              <item.icon className="mb-1 h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Auth Modal */}
      <Modal open={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)}>
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96">
          <h3 className="text-xl font-bold text-center mb-4">
            {isSignup ? "📝 Create Account" : "🔑 Welcome Back"}
          </h3>
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignup && (
              <TextField
                fullWidth
                label="Username"
                name="username"
                onChange={handleChange}
                required
              />
            )}
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              onChange={handleChange}
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSignup ? "Sign Up" : "Sign In"}
            </Button>
          </form>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="w-full mt-4 text-sm text-gray-500"
          >
            Cancel
          </button>
        </Box>
      </Modal>
    </>
  );
};

export default Navbar;
