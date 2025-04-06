// import { Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Forum from "./pages/Forum"; // ✅ Import Forum Page correctly
// import Home from "./pages/Home";
// import Chat from "./pages/Chat";
// import Therapists from "./pages/Therapists";

// // Keep only these small inline components
// //const Therapists = () => <div className="p-5 mt-24 text-center">🩺 Therapist Booking</div>;

// function App() {
//   return (
//     <>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/forum" element={<Forum />} /> {/* ✅ Now using the correct imported Forum component */}
//         <Route path="/chat" element={<Chat />} />
//         <Route path="/therapists" element={<Therapists />} />
//       </Routes>
//     </>
//   );
// }

// export default App;

import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Forum from "./pages/Forum";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Therapists from "./pages/Therapists";
import Signup from "./pages/Signup";  // ✅ Import Signup Page
import Login from "./pages/Login";    // ✅ Import Login Page
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ Import Protected Route
import { AuthProvider } from "./context/AuthContext"; // ✅ Import Auth Context
import Profile from "./pages/Profile"; // Import Profile Page
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/signup" element={<Signup />} />  {/* ✅ Signup Page */}
        <Route path="/login" element={<Login />} />    {/* ✅ Login Page */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* ✅ Protect these routes (Only logged-in users can access) */}
        <Route path="/chat" element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }/>

        <Route path="/therapists" element={
          <ProtectedRoute>
            <Therapists />
          </ProtectedRoute>
        }/>

        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }/>
        
      </Routes>
    </AuthProvider>
  );
}

export default App;

