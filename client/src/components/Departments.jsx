import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode"; // For decoding the token
import api from "../utils/api";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState("");
  const [userId, setUserId] = useState("");

  // Decode the token to get the userId
  useEffect(() => {
    const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.userId); // Assuming the token contains the userId
    }
  }, []);

  // Fetch departments for the user
  useEffect(() => {
    if (userId) {
      fetchDepartments();
    }
  }, [userId]);
  const fetchDepartments = async () => {
    try {
      const response = await api.post(`/employers/getDepartment`, 
        { id: userId }, // Sending the ID in the request body
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      setDepartments(response.data.departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };
  

  // Add a new department
  const handleAddDepartment = async () => {
    if (!newDepartment.trim()) return;

    try {
      const response = await api.post(
        `/employers/addDepartment`,
        { department: newDepartment, id: userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDepartments([...departments, newDepartment]);
      setNewDepartment("");
    } catch (error) {
      console.error("Error adding department:", error);
    }
  };

  // Delete a department
  const handleDeleteDepartment = async (department) => {
    try {
      const response = await api.post(
        `/employers/deleteDepartment`,
        { department, id: userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDepartments(departments.filter((dept) => dept !== department));
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Departments</h2>
      <p className="text-gray-600 mb-6">
        Welcome to the Dashboard! Here you can view and manage your departments.
      </p>

      {/* Add Department Section */}
      <div className="mb-6">
        <input
          type="text"
          value={newDepartment}
          onChange={(e) => setNewDepartment(e.target.value)}
          placeholder="Enter new department"
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddDepartment}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Add Department
        </button>
      </div>

      {/* Display Departments */}
      <div>
        {departments.map((department, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex justify-between items-center p-4 mb-2 bg-gray-50 rounded-lg shadow-sm"
          >
            <span className="text-gray-700">{department}</span>
            <button
              onClick={() => handleDeleteDepartment(department)}
              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
            >
              Delete
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Departments;