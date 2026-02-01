import React, { useState } from "react";
import ActivityForm from "./ActivityForm";
import UserOwnActivityLogs from "./UserOwnActivityLogs";
import { useAuth } from "./context/AuthContext";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("activityform");
  const { logout } = useAuth();
  const renderTabContent = () => {
    switch (activeTab) {
      case "activityform":
        return <ActivityForm />;
      case "ownactivitylogs":
        return <UserOwnActivityLogs />;
      default:
        return <div>Select a section</div>;
    }
  };
  return (
    <div>
      <header className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">User Panel</h1>
        <nav className="space-x-6">
          <button
            className={`${
              activeTab === "userManagement"
                ? "border-b-2 border-white font-semibold"
                : ""
            } hover:opacity-90 cursor-pointer`}
            onClick={() => setActiveTab("activityform")}
          >
            Activity Form
          </button>

          <button
            className={`${
              activeTab === "activityLogs"
                ? "border-b-2 border-white font-semibold"
                : ""
            } hover:opacity-90 cursor-pointer`}
            onClick={() => setActiveTab("ownactivitylogs")}
          >
            Own Activity Logs
          </button>
          <button
            className={`hover:opacity-90 cursor-pointer`}
            onClick={() => logout()}
          >
            Logout
          </button>
        </nav>
      </header>
      <main className="p-6">{renderTabContent()}</main>
    </div>
  );
};

export default UserDashboard;
