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
    name: user?.name || "",
    phone: user?.phone || "",
    organization: user?.organization || "",
  });
  
  // Update the `useEffect` to handle initial values properly
  useEffect(() => {
    if (user) {
      setUpdatedUser({
        name: user.name || "",
        phone: user.phone || "",
        organization: user.organization || "",
      });
    }
  }, [user]);
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("You must log in first.");
      navigate("/login");
      return;
    }

    let decoded = jwtDecode(token);


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
    toast.success("Logged out successfully!");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleEditToggle = () => {
    setEditing(!editing);
    if (!editing) {
      setUpdatedUser(user); // Reset the changes when exiting edit mode
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

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
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
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mt-10 flex flex-col items-center gap-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <img
        src={user.profileUrl || "https://i.pinimg.com/736x/76/f3/f3/76f3f3007969fd3b6db21c744e1ef289.jpg"}
        alt="Profile"
        className="w-24 h-24 rounded-full shadow-md"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://i.pinimg.com/736x/76/f3/f3/76f3f3007969fd3b6db21c744e1ef289.jpg";
        }}
      />

      {editing ? (
        <input
          type="text"
          name="name"
          value={updatedUser.name}
          onChange={handleChange}
          placeholder="Name"
          className="border p-2 rounded w-full"
        />
      ) : (
        <h2 className="text-2xl font-bold text-gray-800">{user.name || "N/A"}</h2>
      )}

      <p className="text-gray-600">{user.email || "Email not provided"}</p>

      <div className="flex items-center gap-2">
        <span className="text-gray-700 font-medium">{user.role || "User"}</span>
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${user.isVerified ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
        >
          {user.isVerified ? "Verified" : "Not Verified"}
        </span>
      </div>

      {editing ? (
        <input
          type="text"
          name="organization"
          value={updatedUser.organization}
          onChange={handleChange}
          placeholder="Organization"
          className="border p-2 rounded w-full"
        />
      ) : (
        <p className="text-gray-600">{user.organization || "No organization"}</p>
      )}

      {editing ? (
        <input
          type="text"
          name="phone"
          value={updatedUser.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="border p-2 rounded w-full"
        />
      ) : (
        <p className="text-gray-600">📞 {user.phone || "Phone not provided"}</p>
      )}

      {editing ? (
        <div className="flex gap-2">
          <motion.button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Save Changes
          </motion.button>
          <motion.button
            onClick={handleEditToggle}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
        </div>
      ) : (
        <motion.button
          onClick={handleEditToggle}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Edit Profile
        </motion.button>
      )}

      <motion.button
        onClick={handleLogout}
        className="text-red-500 border px-4 py-2 rounded hover:text-white hover:bg-red-500 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Logout
      </motion.button>
    </motion.div>
  );
};

export default Profile;
