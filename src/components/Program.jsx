import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "./context/AuthContext";

const Program = () => {
  const { user } = useAuth();
  const token = user?.token;

  const [programs, setPrograms] = useState([]);
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const err = {};
    if (!formData.name.trim()) err.name = "Program name is required";
    if (!formData.description.trim()) err.description = "Description is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleCreateProgram = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setApiError("");

    try {
      const res = await fetch("http://localhost:8080/api/admin/programs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error || "something went wrong");
        return;
      }

      await fetchPrograms(); // reload programs table after new addition

      setFormData({ name: "", description: "" });
      setErrors({});
    } catch (e) {
      console.error(e);
      setApiError("please try again ");
    } finally {
      setLoading(false);
    }
  };

//getting programs
  const fetchPrograms = async () => {
    if (!token) return;

    try {
      const res = await fetch("http://localhost:8080/api/admin/programs", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        setApiError(errorData.error || "failed to fetch");
        return;
      }

      const data = await res.json();
      setPrograms(data);
    } catch (e) {
      console.error("error", e);
      setApiError("could not fetch");
    }
  };

  useEffect(() => {
    fetchPrograms(); // load programs from backend
  }, [token]);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Program</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {apiError && <p className="text-red-600 text-sm mb-2">{apiError}</p>}

          <div>
            <Label>Program Name</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <Label>Description</Label>
            <Input
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          <Button onClick={handleCreateProgram} disabled={loading}>
            {loading ? "Creating..." : "Create Program"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Programs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programs.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Program;
