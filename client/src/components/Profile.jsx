import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import api from "../utils/api";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    name: "",
    phone: "",
    organization: "",
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("You must log in first.");
      navigate("/login");
      return;
    }

    const decoded = jwtDecode(token);

    const fetchUser = async () => {
      try {
        const response = await api.get(`/users/${decoded.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setUser(response.data.user);
          setUpdatedUser(response.data.user);
        } else {
          toast.error("Failed to load profile. No data found.");
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        toast.error("Failed to load profile.");
      }
    };

    fetchUser();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("Logged out successfully!");
  };

  const handleEditToggle = () => {
    setEditing(!editing);
    if (!editing) {
      setUpdatedUser(user); // Reset changes when exiting edit mode
    }
  };

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await api.put("/users/updateProfileDetails", updatedUser, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        setUser(updatedUser);
        setEditing(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  const handleDeleteRequest = async () => {
    try {
      const decoded = jwtDecode(token);
      const { email, userId } = decoded;

      const otpResponse = await api.post("employers/OtpSend", { email });

      if (otpResponse.data.success) {
        navigate("/otpPrompt", { state: { email, id: userId } });
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-50 to-purple-50">
        <motion.div
          className="text-lg text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Loading profile...
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-r flex justify-center items-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 space-y-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Profile Header */}
        <div className="flex flex-col items-center space-y-4">
          <motion.img
            src={user.profileUrl || "https://i.pinimg.com/736x/76/f3/f3/76f3f3007969fd3b6db21c744e1ef289.jpg"}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://i.pinimg.com/736x/76/f3/f3/76f3f3007969fd3b6db21c744e1ef289.jpg";
            }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <h2 className="text-3xl font-bold text-gray-800">{user.name || "N/A"}</h2>
          <p className="text-gray-500">{user.email || "Email not provided"}</p>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">{user.role || "User"}</span>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                user.isVerified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {user.isVerified ? "Verified" : "Not Verified"}
            </span>
          </div>
        </div>

        {/* Profile Details */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Organization</label>
            {editing ? (
              <input
                type="text"
                name="organization"
                value={updatedUser.organization}
                onChange={handleChange}
                placeholder="Organization"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-600">{user.organization || "No organization"}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Phone</label>
            {editing ? (
              <input
                type="text"
                name="phone"
                value={updatedUser.phone}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 10 && /^[0-9]*$/.test(value)) {
                    handleChange(e);
                  }
                }}
                placeholder="Phone"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onBlur={(e) => {
                  if (e.target.value.length !== 10) {
                    toast.error("Phone number must be exactly 10 digits.");
                  }
                }}
              />
            ) : (
              <p className="text-gray-600">
                📞 {user.phone && /^\d{10}$/.test(user.phone) ? user.phone : "Phone not provided"}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          {editing ? (
            <>
              <motion.button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Save
              </motion.button>
              <motion.button
                onClick={handleEditToggle}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
            </>
          ) : (
            <motion.button
              onClick={handleEditToggle}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Edit Profile
            </motion.button>
          )}
        </div>

        {/* Logout and Delete Buttons */}
        <div className="flex justify-center space-x-4">
          <motion.button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Logout
          </motion.button>
          <motion.button
            onClick={openDeleteModal}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Delete Account
          </motion.button>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg p-6 w-96 text-center"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className="text-xl font-bold mb-4">Delete Account</h2>
            <p className="mb-6 text-gray-600">Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="flex justify-center space-x-4">
              <motion.button
                onClick={handleDeleteRequest}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Yes, Delete
              </motion.button>
              <motion.button
                onClick={closeDeleteModal}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Profile;