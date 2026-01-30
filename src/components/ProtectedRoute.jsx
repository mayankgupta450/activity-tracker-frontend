import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // If not authenticated, redirect to login page
  if (!isAuthenticated) return <Navigate to="/" replace />;

  // validate role against backend
  if (role && user.role !== role) {
    return (
      <Navigate
        to={user.role === "ROLE_ADMIN" ? "/admindashboard" : "/userdashboard"}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
