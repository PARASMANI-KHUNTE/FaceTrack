import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import api from '../../utils/api';
import Loader from '../../components/utilsComponents/Loader';
import { toast } from '../../components/utilsComponents/Toast';
import {jwtDecode} from 'jwt-decode';
import Navbar from "../../components/Client/Navbar";
const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    organization: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('users/signup-employer', formData);
      toast.success(response.data.message);
      navigate('/verify-otp', { state: { email: formData.email, context: 'signup' } });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
    const token = credentialResponse?.credential; // Ensure token exists
      if (!token) {
        throw new Error("Google login failed: No token received.");
      }

      const decoded = jwtDecode(token); // Decode the token
      const { sub: googleId, name, email, picture } = decoded; // Extract details
      navigate('/ContinueWithGoogle',{state : {googleId :googleId , name : name, email : email, picture : picture }})
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
       <Navbar />
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
        />
       <input
          type="text"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => {
            const value = e.target.value;
            // Only update if the length is <= 10 and contains only numbers
            if (value.length <= 10 && /^[0-9]*$/.test(value)) {
              setFormData({ ...formData, phone: value });
            }
          }}
          className="w-full p-2 mb-4 border rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="text"
          placeholder="Organization"
          value={formData.organization}
          onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
        />
        <button type="submit" className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700">
          {loading ? <Loader /> : 'Sign Up'}
        </button>
        <div className="mt-6 text-center">
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => toast.error('Google login failed. Please try again.')}
            />
          </GoogleOAuthProvider>
        </div>
      </form>
    </div>
  );
};

export default Signup;