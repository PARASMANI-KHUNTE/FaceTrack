import { useState } from "react";
import Dashboard from "../components/Client/Dashboard";
import Employee from "../components/Client/Employee";
import EmployeeList from "../components/Client/EmployeeList";
import Attendance from "../components/Client/Attendance";
import Report from "../components/Client/Report";
import Profile from "../components/Client/Profile";
import Departments from "../components/Client/Departments";
import { Menu } from "lucide-react";

const ClientPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sidebar items
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "Employee", label: "Employee", icon: "👥" },
    { id: "EmployeeList", label: "Employee List", icon: "👥" },
    { id: "attendance", label: "Attendance", icon: "📅" },
    { id: "department", label: "Departments", icon: "🏬" },
    { id: "report", label: "Report", icon: "📊" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "Employee":
        return <Employee />;
      case "EmployeeList":
        return <EmployeeList />;
      case "attendance":
        return <Attendance />;
      case "department":
        return <Departments />;
      case "report":
        return <Report />;
      case "profile":
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-purple-900 to-blue-900">
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden p-4 text-white" 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu size={28} />
      </button>

      {/* Sidebar */}
      <div 
        className={`absolute min-h-screen md:relative bg-gray-800 bg-opacity-90 backdrop-blur-md text-white p-6 w-64 md:w-72 h-full z-50 md:block transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <h1 className="text-2xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
          Client Panel
        </h1>
        <ul className="space-y-4">
          {sidebarItems.map((item) => (
            <li
              key={item.id}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg"
                  : "hover:bg-gray-700"
              }`}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-lg">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-auto min-w-0">
        {renderContent()}
      </div>
    </div>
  );
};

export default ClientPanel;