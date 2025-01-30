import { useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/api"; // Assuming API utility is set up

const PersonalInfoForm = ({ onNext, onPrev, employeeId }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  console.log("Received Employee ID:", employeeId);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeId) {
      toast.error("Employee ID is missing. Please capture your face first.");
      return;
    }

    try {
      const response = await api.post("/employers/addEmployee", {
        ...formData,
        employeeId, // Send the employeeId to associate this user with the face data
      });

      if (response.status === 201) { 
        toast.success(response.data.message);
        const user_Id = response.data.userId
        const user_email = response.data.email
        onNext({ ...formData, employeeId ,user_Id ,user_email }); // Proceed to next step
      } else {
        toast.error(response.data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error(error.response?.data?.message || "Error checking user. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">Personal Information</h2>
      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
      <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded" required />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded" required />
      <div className="flex justify-between">
        <button type="button" onClick={onPrev} className="bg-gray-500 text-white px-4 py-2 rounded">Back</button>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Next</button>
      </div>
    </form>
  );
};

export default PersonalInfoForm;
