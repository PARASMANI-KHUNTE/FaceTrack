import { useEffect, useState } from "react";
import api from '../../utils/api';
import { jwtDecode } from "jwt-decode";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [employerId, setEmployerId] = useState('');
  const [filterDate, setFilterDate] = useState('');

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
        setEmployees([]);
      }
    };
    
    fetchEmployees();
  }, [employerId]);

  const filteredEmployees = employees.filter(emp => 
    !filterDate || (emp.checkInOut && emp.checkInOut.some(entry => 
      new Date(entry.date).toISOString().split('T')[0] === filterDate))
  );

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center sm:text-left">Employee List</h2>
      <nav className="mb-4 p-4 bg-gray-100 rounded-lg flex flex-col sm:flex-row items-center gap-4">
        <label className="font-semibold">Filter by Date:</label>
        <input 
          type="date" 
          className="border p-2 rounded w-full sm:w-auto" 
          value={filterDate} 
          onChange={(e) => setFilterDate(e.target.value)} 
        />
      </nav>
      
      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <th className="p-3 border text-left">Employer ID</th>
              <th className="p-3 border text-left">Employee ID</th>
              <th className="p-3 border text-left">Task</th>
              <th className="p-3 border text-left">Shift</th>
              <th className="p-3 border text-left">Department</th>
              <th className="p-3 border text-left">Latest Check-in</th>
              <th className="p-3 border text-left">Latest Check-out</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr key={emp._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 border">{emp.employer}</td>
                  <td className="p-3 border">{emp._id}</td>
                  <td className="p-3 border">{emp.tasks.join(", ")}</td>
                  <td className="p-3 border">{emp.shift}</td>
                  <td className="p-3 border">{emp.department}</td>
                  <td className="p-3 border">
                    {emp.checkInOut && emp.checkInOut.length > 0 ? 
                      new Date(emp.checkInOut[emp.checkInOut.length - 1].checkIn).toLocaleTimeString() : "N/A"}
                  </td>
                  <td className="p-3 border">
                    {emp.checkInOut && emp.checkInOut.length > 0 ? 
                      new Date(emp.checkInOut[emp.checkInOut.length - 1].checkOut).toLocaleTimeString() : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">No employees found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
