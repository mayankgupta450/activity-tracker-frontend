import React, { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, Loader2 } from "lucide-react";

const ActivityForm = () => {
  const { user, setSettingUserId } = useAuth();
  const token = user?.token;

  const [formData, setFormData] = useState({
    programId: "",
    activityTypeId: "",
    workContextId: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    outputCount: "",
  });
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [workContexts, setWorkContexts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // fetch activity types
  const fetchActivityTypes = async () => {
    if (!token) return;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const res = await fetch("http://localhost:8080/activityTypeData", {
        method: "GET",
        headers,
      });

      if (!res.ok) {
        throw new Error(`failed: ${res.status}`);
      }

      const data = await res.json();
      console.log("activity: ", data);
      setActivityTypes(data); // set to state
    } catch (error) {
      console.error("failed", error);
    }
  };

  //fetch work context
  const fetchWorkContext = async () => {
    if (!token) return;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const res = await fetch("http://localhost:8080/workContextData", {
        method: "GET",
        headers,
      });

      if (!res.ok) {
        throw new Error(`failed: ${res.status}`);
      }

      const data = await res.json();
      setWorkContexts(data);
    } catch (error) {
      console.error("failed", error);
    }
  };

  //fetch user specifci
  const fetchUserSpecificProgramsOnly = async () => {
    if (!token) return;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const res = await fetch("http://localhost:8080/user-specific-programs", {
        method: "GET",
        headers,
      });

      if (!res.ok) {
        throw new Error(`failed ${res.status}`);
      }

      const data = await res.json();
      console.log("data user-> ", data);
      setPrograms(data);
      const userId = data?.[0]?.userId ?? null;
      setSettingUserId(userId);
      console.log("UserId set to:", userId);
    } catch (error) {
      console.error("failed", error);
    }
  };

  // Call the function inside useEffect
  useEffect(() => {
    fetchActivityTypes();
    fetchWorkContext();
    fetchUserSpecificProgramsOnly();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const activityData = {
        programId: Number(formData.programId),
        activityTypeId: formData.activityTypeId,
        workContextId: formData.workContextId,
        description: formData.description,
        outputCount: Number(formData.outputCount),
        date: formData.date,
        userId: selectedUserId,
      };

      console.log("Submitted Activity Data:", activityData);

      const response = await fetch("http://localhost:8080/save-activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(activityData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to save activity");
      }

      const result = await response.json();
      console.log("Activity saved successfully:", result);
      resetForm();
    } catch (err) {
      console.error("Error saving activity:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // validation handling
  const validateForm = () => {
    const newErrors = {};

    if (!formData.programId) {
      newErrors.programId = "Please select a program";
    }

    if (!formData.activityTypeId) {
      newErrors.activityTypeId = "Please select an activity type";
    }

    if (!formData.workContextId) {
      newErrors.workContextId = "Please select a work context";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.date) {
      newErrors.date = "Please select a date";
    }

    if (!formData.outputCount) {
      newErrors.outputCount = "Output count is required";
    }
    if (
      formData.activityTypeId === "TASK_EXECUTION" &&
      Number(formData.outputCount) < 1
    ) {
      newErrors.outputCount =
        "Output count must be greater than or equal to 1 for Task Execution";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  //reset form
  const resetForm = () => {
    setFormData({
      programId: "",
      activityTypeId: "",
      workContextId: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      outputCount: "",
    });
    setErrors({});
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Log Activity</h1>
          <p className="text-muted-foreground mt-1">
            Record your field activity
          </p>
        </div>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Activity Details</CardTitle>
          <CardDescription>
            Fill in the details of the activity you performed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Program Dropdown */}
            <div className="space-y-2">
              <Label>Program *</Label>
              <Select
                value={formData.programId}
                onValueChange={(value) => {
                  const selectedProgram = programs.find(
                    (p) => p.programId.toString() === value,
                  );
                  setFormData({
                    ...formData,
                    programId: value,
                  });
                  setSelectedUserId(selectedProgram.userId);
                  setErrors({ ...errors, programId: "" });
                }}
              >
                {errors.programId && (
                  <p className="text-sm text-red-500">{errors.programId}</p>
                )}

                <SelectTrigger>
                  <SelectValue placeholder="Select a program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem
                      key={program.programId}
                      value={program.programId.toString()}
                    >
                      {program.programName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Activity Type *</Label>
              <Select
                value={formData.activityTypeId}
                onValueChange={(value) => {
                  setFormData({ ...formData, activityTypeId: value });
                  setErrors({ ...errors, activityTypeId: "" });
                }}
              >
                {errors.activityTypeId && (
                  <p className="text-sm text-red-500">
                    {errors.activityTypeId}
                  </p>
                )}
                <SelectTrigger>
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map((type, index) => (
                    <SelectItem key={index} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Work Context *</Label>
              <Select
                value={formData.workContextId}
                onValueChange={(value) => {
                  setFormData({ ...formData, workContextId: value });
                  setErrors({ ...errors, workContextId: "" });
                }}
              >
                {errors.workContextId && (
                  <p className="text-sm text-red-500">{errors.workContextId}</p>
                )}

                <SelectTrigger>
                  <SelectValue placeholder="Select work context" />
                </SelectTrigger>
                <SelectContent>
                  {workContexts.map((type, index) => (
                    <SelectItem key={index} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date *</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => {
                  setFormData({ ...formData, date: e.target.value });
                  setErrors({ ...errors, date: "" });
                }}
                max={new Date().toISOString().split("T")[0]}
              />
              {errors.date && (
                <p className="text-sm text-red-500">{errors.date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  setErrors({ ...errors, description: "" });
                }}
                rows={5}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Output Count</Label>
              <Input
                type="number"
                min={0}
                value={formData.outputCount}
                onChange={(e) => {
                  setFormData({ ...formData, outputCount: e.target.value });
                  setErrors({ ...errors, outputCount: "" });
                }}
              />
              {errors.outputCount && (
                <p className="text-sm text-red-500">{errors.outputCount}</p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 gradient-accent text-accent-foreground text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" /> Submit Activity
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityForm;
