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
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import {useNavigate } from "react-router-dom";

const ActivityForm = ({ addActivity }) => {
  const { user } = useAuth();
  const token = user?.token;
  const navigate = useNavigate();

  const initialProgramId ="";

  const [formData, setFormData] = useState({
    programId: initialProgramId,
    activityTypeId: "",
    workContextId: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    outputCount: "",
  });

  const [programs, setPrograms] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [workContexts, setWorkContexts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      console.log("dta ",data);
      setPrograms(data);
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

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
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
                onValueChange={(value) =>
                  setFormData({ ...formData, programId: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a program" />
                </SelectTrigger>
                <SelectContent>
                   {programs.map((type, index) => (
                    <SelectItem key={index} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Activity Type *</Label>
              <Select
                value={formData.activityTypeId}
                onValueChange={(value) =>
                  setFormData({ ...formData, activityTypeId: value })
                }
                required
              >
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

            {/* Work Context Dropdown */}
            <div className="space-y-2">
              <Label>Work Context *</Label>
              <Select
                value={formData.workContextId}
                onValueChange={(value) =>
                  setFormData({ ...formData, workContextId: value })
                }
                required
              >
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

            {/* Date */}
            <div className="space-y-2">
              <Label>Date *</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                max={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={5}
                required
              />
            </div>

            {/* Output Count */}
            <div className="space-y-2">
              <Label>Output Count</Label>
              <Input
                type="number"
                value={formData.outputCount}
                onChange={(e) =>
                  setFormData({ ...formData, outputCount: e.target.value })
                }
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 gradient-accent text-accent-foreground"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
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
