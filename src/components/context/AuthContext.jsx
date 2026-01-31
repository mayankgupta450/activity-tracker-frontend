import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    email: null,
    role: null,
    token: null,
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userEmail");

    setUser({ email: null, role: null, token: null });
    setIsAuthenticated(false);
  };

  //  validate token and fetch role from backend whenever page refresh
  const validateToken = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/auth/validate-token", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Invalid token");

      const data = await res.json();
      setUser({ email: data.email, role: data.role, token });
      setIsAuthenticated(true);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  const login = ({ email, token, role }) => {
    localStorage.setItem("jwtToken", token);
    localStorage.setItem("userEmail", email);
    setUser({ email, role, token });
    setIsAuthenticated(true);
    setLoading(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        loading,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
