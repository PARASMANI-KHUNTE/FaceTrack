import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from '../utils/api';
import { jwtDecode } from "jwt-decode";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [employerId, setEmployerId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setEmployerId(decoded.userId);
    }
  }, []);

  useEffect(() => {
    if (!employerId) return;
    
    const fetchEmployees = async () => {
      try {
        console.log("Fetching employees for employerId:", employerId);
        const response = await api.post("/employers/getEmployees", { id: employerId }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("API Response:", response.data);
        
        const employeeData = response.data.employees;
        setEmployees(employeeData && typeof employeeData === 'object' ? [employeeData] : []);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setEmployees([]); // Ensure employees remain an array
      }
    };
    
    fetchEmployees();
  }, [employerId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Employee List</h2>
      <div className="grid grid-cols-1 gap-4">
        {Array.isArray(employees) && employees.length > 0 ? (
          employees.map((emp) => (
            <motion.div 
              key={emp._id} 
              className="border p-4 rounded-lg shadow-md bg-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <p className="text-gray-700"><strong>Employer ID:</strong> {emp.employer}</p>
              <p className="text-gray-700"><strong>Employee ID:</strong> {emp._id}</p>
              <p className="text-gray-700"><strong>Task:</strong> {emp.tasks.join(", ")}</p>
              <p className="text-gray-700"><strong>Shift:</strong> {emp.shift}</p>
              <p className="text-gray-700"><strong>Department:</strong> {emp.department}</p>
              {emp.checkInOut && emp.checkInOut.length > 0 && (
                <div className="mt-2">
                  <h3 className="text-md font-semibold">Latest Check-in/Out</h3>
                  <p className="text-gray-700"><strong>Date:</strong> {new Date(emp.checkInOut[emp.checkInOut.length - 1].date).toLocaleDateString()}</p>
                  <p className="text-gray-700"><strong>Check-in:</strong> {emp.checkInOut[emp.checkInOut.length - 1].checkIn ? new Date(emp.checkInOut[emp.checkInOut.length - 1].checkIn).toLocaleTimeString() : "N/A"}</p>
                  <p className="text-gray-700"><strong>Check-out:</strong> {emp.checkInOut[emp.checkInOut.length - 1].checkOut ? new Date(emp.checkInOut[emp.checkInOut.length - 1].checkOut).toLocaleTimeString() : "N/A"}</p>
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500">No employees found.</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
