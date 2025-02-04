import { toast } from 'react-toastify';
import api from '../../utils/api';
import { useEffect, useState } from 'react';
import Loader from '../../components/utilsComponents/Loader';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const ContinueWithGoogle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { googleId, name, email, picture } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [getData, setGetData] = useState(false); // Controls form visibility
  const [formData, setFormData] = useState({
    googleId,
    name,
    email,
    profileUrl: picture,
    phone: '',
    organization: '',
  });

  console.log(formData);

  // Check if the user already exists
  const checkForExistence = async () => {
    if (!googleId || !email) return; // Ensure required data is available
    try {
      const response = await api.post('/users/checkForExistence', { googleId, email });
      if (!response.data?.success) {
        setGetData(true);
      } else {
        toast.success(response.data.message);
        localStorage.setItem('token',response.data.token)
        navigate('/client-panel');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
      setGetData(true); // Allow form submission even if check fails
    }
  };

  // Run existence check once on component mount
  useEffect(() => {
    checkForExistence();
  }, []); // No dependencies needed to prevent re-runs

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/users/googleLogin', formData);
      if (response.status === 201) {
        toast.success(response.data.message);
        localStorage.setItem('token',response.data.token)
        navigate('/client-panel');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
  
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      {getData && (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 10 && /^[0-9]*$/.test(value)) {
                  setFormData({ ...formData, phone: value });
                }
              }}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <label htmlFor="organization" className="block text-gray-700 font-medium mb-1">
              Organization
            </label>
            <input
              type="text"
              id="organization"
              placeholder="Enter your organization"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300"
          >
            {loading ? <Loader /> : 'Sign Up'}
          </motion.button>
        </motion.form>
      )}
    </motion.div>
  );
};

export default ContinueWithGoogle;
