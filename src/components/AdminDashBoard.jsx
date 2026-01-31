import React from "react";
import UserManagement from "./UserManagement";

const AdminDashBoard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <UserManagement />
    </div>
  );
};

export default AdminDashBoard;
