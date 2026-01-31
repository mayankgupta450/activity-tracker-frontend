import "./App.css";
import Login from "./components/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserDashboard from "./components/UserDashboard";
import AdminDashBoard from "./components/AdminDashBoard";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Admin */}
        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <AdminDashBoard />
            </ProtectedRoute>
          }
        />

        {/* User */}
        <Route
          path="/userdashboard"
          element={
            <ProtectedRoute role="ROLE_USER">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
