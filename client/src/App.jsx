import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import FaceTrackLandingPage from "./pages/FaceTrackLandingPage";
import Signup from './pages/Auth/Signup';
import VerifyOtp from './pages/Auth/VerifyOtp';
import Login from './pages/Auth/Login';
import ResetPassword from './pages/Auth/ResetPassword';
import UpdatePassword from './pages/Auth/UpdatePassword';
import ClientPanel from './pages/ClientPanel';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OtpPrompt from "./components/utilsComponents/OtpPrompt";
import ContinueWithGoogle from "./pages/Auth/ContinueWithGoogle";

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token'); // Check if the user is authenticated
  return isAuthenticated ? children : <Navigate to="/login" />; // Redirect to login if not authenticated
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<FaceTrackLandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/ContinueWithGoogle" element={<ContinueWithGoogle />} />

        {/* Protected Routes */}
        <Route
          path="/client-panel"
          element={
            <ProtectedRoute>
              <ClientPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/otpPrompt"
          element={
            <ProtectedRoute>
              <OtpPrompt />
            </ProtectedRoute>
          }
        />

        {/* Fallback Route (Optional) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;