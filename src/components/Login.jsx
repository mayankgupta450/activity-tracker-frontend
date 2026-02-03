import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "./context/AuthContext";

const Login = () => {
  const { login, isAuthenticated, user,setLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");

  //  Redirect if already logged in user
  if (isAuthenticated) {
    if (user.role === "ROLE_ADMIN")
      return <Navigate to="/admindashboard" replace />;
    if (user.role === "ROLE_USER")
      return <Navigate to="/userdashboard" replace />;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      //Call backend API
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Extract token, email, role from backend response
        const { token, email, role } = data;

        login({ email, token, role });

        navigate(role === "ROLE_ADMIN" ? "/admindashboard" : "/userdashboard");
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (error) {
      setMessage(data || "Login failed");
      console.error(error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4 shadow-elevated">
            <Activity className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Activity Tracker
          </h1>
          <p className="text-muted-foreground mt-1">
            Khushi Baby Health Programs
          </p>
        </div>
        <Card className="shadow-elevated border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Sign in</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@khushibaby.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {message && (
                <div
                  className={`p-2 rounded text-white text-center ${
                    messageType === "success" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {message}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 gradient-accent text-accent-foreground font-medium text-white"
              >
                Sign in
              </Button>
            </form>

            <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm font-medium text-foreground mb-2">
                Demo Credentials
              </p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  <strong>Admin:</strong> admin@khushibaby.org
                </p>
                <p>
                  <strong>Password:</strong> password123
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
