import { useNavigate } from "react-router-dom";

const EmployeeList = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <nav className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Employee List</h2>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
          onClick={() => navigate("/employee-form")}
        >
          Add Employee
        </button>
      </nav>
      <p className="text-gray-600">Manage your employees here.</p>
    </div>
  );
};

export default EmployeeList;
