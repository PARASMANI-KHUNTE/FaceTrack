
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FaceTrackLandingPage from "./pages/FaceTrackLandingPage";
import Signup from './pages/Signup';
import VerifyOtp from './pages/VerifyOtp';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import UpdatePassword from './pages/UpdatePassword';
import ClientPanel from './pages/ClientPanel';
import ProtectedRoute from './components/ProtectedRoute';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<FaceTrackLandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/client-panel" element={ <ProtectedRoute>
              <ClientPanel />
            </ProtectedRoute>} />
        
      
        
      </Routes>
      <ToastContainer />
    </Router>

  );
};

export default App;