import  { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../utils/api"
import { jwtDecode } from "jwt-decode";
const DepartmentShiftTaskForm = ({ onSubmit, onPrev }) => {
  const [departments, setDepartments] = useState([]);
  const [userId, setUserId] = useState("");
  const [formData, setFormData] = useState({
    department: "",
    shift: "",
    task: "",
  });

  // Decode the token to get the userId
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        setUserId(decoded.userId);
      }
    }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.post("/employers/getDepartment",{id : userId},{
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
          });
        setDepartments(response.data.departments);
      } catch (error) {
        toast.error("Error fetching departments");
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/submit-registration", formData);
      toast.success("Registration successful");
      onSubmit();
    } catch (error) {
      toast.error("Error submitting registration");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">Department, Shift, Task</h2>
      <select name="department" value={formData.department} onChange={handleChange} className="w-full p-2 border rounded" required>
        <option value="">Select Department</option>
        {departments.map((dept, index) => (
  <option key={dept.id || index} value={dept.name}>{dept.name}</option>
))}

      </select>
      <input type="text" name="shift" placeholder="Shift" value={formData.shift} onChange={handleChange} className="w-full p-2 border rounded" required />
      <input type="text" name="task" placeholder="Task" value={formData.task} onChange={handleChange} className="w-full p-2 border rounded" required />
      <div className="flex justify-between">
        <button type="button" onClick={onPrev} className="bg-gray-500 text-white px-4 py-2 rounded">Back</button>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
      </div>
    </form>
  );
};

export default DepartmentShiftTaskForm;
