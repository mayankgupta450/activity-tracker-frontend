import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "./context/AuthContext";

const UserManagement = () => {
  const { user } = useAuth();
  const [apiError, setApiError] = useState("");
  const token = user?.token;

  //dummy data as of now
  const [users, setUsers] = useState([]);
  const [programs, setPrograms] = useState([]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    programIds: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  //validation logic
  const validateForm = () => {
    const err = {};

    if (!formData.username.trim()) err.username = "Username is required";

    if (!formData.email.trim()) err.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      err.email = "Invalid email";

    if (!formData.password.trim()) err.password = "Password is required";
    else if (formData.password.length < 6) err.password = "Min 6 characters";

    if (!formData.role) err.role = "Role is required";
    if (!formData.programIds.length)
      err.programIds = "At least one program is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleCreateUser = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setApiError(""); // reset previous api errro
    try {
      const res = await fetch("http://localhost:8080/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error || "Something went wrong");
        return;
      }
      await fetchUsers(); //again calling api to fetch the data

      setFormData({
        username: "",
        email: "",
        password: "",
        role: "",
       programIds: [],
  
      });
      setErrors({});
    } catch (e) {
      console.error(e);
      setApiError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8080/api/admin/users", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        setApiError(errorData.error || "Failed to fetch users");
        return;
      }

      const data = await res.json();
      setUsers(data);
    } catch (e) {
      console.error("Fetch users error:", e);
      setApiError("Network error. Could not fetch users.");
    }
  };

  // Fetch programs from backend
  const fetchPrograms = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8080/api/admin/programs", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setPrograms(data);
    } catch (e) {
      console.error("Fetch programs error:", e);
    }
  };

  useEffect(() => {
    fetchUsers(); // load user from backend
    fetchPrograms();
  }, [token]);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create User</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {apiError && <p className="text-red-600 text-sm mb-2">{apiError}</p>}
          <div>
            <Label>Username</Label>
            <Input
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>

          <div>
            <Label>Email</Label>
            <Input
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div>
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <div>
            <Label>Role</Label>
            <Select
              value={formData.role}
              onValueChange={(v) => {
                setFormData({ ...formData, role: v });
                setErrors({ ...errors, role: "" });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">ADMIN</SelectItem>
                <SelectItem value="1">USER</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-red-500 text-sm">{errors.role}</p>
            )}
          </div>
          <div>
            <Label>Programs</Label>

            <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
              {programs.map((p) => (
                <div key={p.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={p.id}
                    checked={formData.programIds.includes(p.id)}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        programIds: e.target.checked
                          ? [...prev.programIds, id]
                          : prev.programIds.filter((pid) => pid !== id),
                      }));
                      setErrors({ ...errors, programIds: "" });
                    }}
                  />
                  <span>{p.name}</span>
                </div>
              ))}
            </div>

            {errors.programIds && (
              <p className="text-red-500 text-sm">{errors.programIds}</p>
            )}
          </div>

          <Button onClick={handleCreateUser} disabled={loading}>
            {loading ? "Creating..." : "Create User"}
          </Button>
        </CardContent>
      </Card>

      {/* exsiitng user shown */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Users</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer">ID</TableHead>
                <TableHead className="cursor-pointer">Username</TableHead>
                <TableHead className="cursor-pointer">Email</TableHead>
                <TableHead className="cursor-pointer">Role</TableHead>
                <TableHead className="cursor-pointer">
                  Assigned Program
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.id}</TableCell>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>{u.programNames?.join(", ")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
