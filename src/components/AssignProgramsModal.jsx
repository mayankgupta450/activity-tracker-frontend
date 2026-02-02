import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "./context/AuthContext";

const AssignProgramsModal = ({ user, programs, onClose, onSuccess }) => {
//   const { user } = useAuth();
//   const token = user?.token;
  const [selectedPrograms, setSelectedPrograms] = useState([]);

  // setting intial all program 
  useEffect(() => {
    setSelectedPrograms(user.programIds || []);
  }, [user]);

  const toggleProgram = (id) => {
    setSelectedPrograms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const savePrograms = async () => {
    await fetch(`http://localhost:8080/api/admin/users/${user.id}/programs`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(selectedPrograms),
    });

    onSuccess(); // refresh users
    onClose(); // close modal
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <Card className="w-[420px]">
        <CardHeader>
          <CardTitle>Assign Programs – {user.username}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 max-h-80 overflow-y-auto">
          {programs.map((p) => (
            <div key={p.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedPrograms.includes(p.id)}
                onChange={() => toggleProgram(p.id)}
              />
              <span>{p.name}</span>
            </div>
          ))}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={savePrograms}>Save</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssignProgramsModal;
