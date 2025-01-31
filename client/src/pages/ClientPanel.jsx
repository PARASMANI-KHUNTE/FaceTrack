import  { useState } from "react";
import { motion } from "framer-motion";
import Dashboard from "../components/Dashboard";
import Employee from "../components/Employee";
import EmployeeList from "../components/EmployeeList";
import Attendance from "../components/Attendance";
import Report from "../components/Report";
import Profile from "../components/Profile";
import Departments from "../components/Departments";

const ClientPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

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
    <div className="min-h-screen bg-gradient-to-r from-purple-900 to-blue-900 flex">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-gray-800 bg-opacity-90 backdrop-blur-md text-white p-6"
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
              onClick={() => setActiveTab(item.id)}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-lg">{item.label}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 p-8 overflow-y-auto"
      >
        {renderContent()}
      </motion.div>
    </div>
  );
};

export default ClientPanel;