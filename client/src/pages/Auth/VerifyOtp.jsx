import  { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../utils/api';
import Loader from '../../components/utilsComponents/Loader';
import { toast } from 'react-toastify';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, context } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !otp) {
      toast.error('Email and OTP are required.');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('users/verify-otp', { email, otp });
      toast.success(response.data.message);
      if (context === 'signup') {
        navigate('/login');
      } else if (context === 'resetpassword') {
        navigate('/update-password', { state: { email } });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>
        <input
          type="text"
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <button type="submit" className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700">
          {loading ? <Loader /> : 'Verify OTP'}
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;