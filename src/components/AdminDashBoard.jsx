import React, { useState } from "react";
import UserManagement from "./UserManagement";
import Program from "./Program";
import { useNavigate } from "react-router-dom";
import ActivityLogs from "./ActivityLogs";
import { useAuth } from "./context/AuthContext";

const AdminDashBoard = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("userManagement");

  const renderTabContent = () => {
    switch (activeTab) {
      case "userManagement":
        return <UserManagement />;
      case "program":
        return <Program />;
      case "activityLogs":
        return <ActivityLogs />;
      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <div>
      <header className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <nav className="space-x-6">
          <button
            className={`${
              activeTab === "userManagement"
                ? "border-b-2 border-white font-semibold"
                : ""
            } hover:opacity-90`}
            onClick={() => setActiveTab("userManagement")}
          >
            User Management
          </button>

          <button
            className={`${
              activeTab === "program"
                ? "border-b-2 border-white font-semibold"
                : ""
            } hover:opacity-90`}
            onClick={() => setActiveTab("program")}
          >
            Create Program
          </button>

          <button
            className={`${
              activeTab === "activityLogs"
                ? "border-b-2 border-white font-semibold"
                : ""
            } hover:opacity-90`}
            onClick={() => setActiveTab("activityLogs")}
          >
            Activity Logs
          </button>
          <button className={`hover:opacity-90 cursor-pointer`} onClick={() =>  logout()}>
            Logout
          </button>
        </nav>
      </header>
      <main className="p-6">{renderTabContent()}</main>
    </div>
  );
};

export default AdminDashBoard;
