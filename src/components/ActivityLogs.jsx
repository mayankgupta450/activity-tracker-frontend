import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Download } from "lucide-react";
import { useAuth } from "./context/AuthContext";
import BarChart from "./BarChart";

const ActivityLogs = () => {
  const { user } = useAuth();
  const token = user?.token;
  const [programOutputCount, setProgramOutputCount] = useState([]);
  const [programActivity, setProgramActivity] = useState([]);

  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  //keys not to print data on ui
  const excludedKeys = ["id", "programId"];

  // fetching data
  const fetchActivities = async () => {
    try {
      const res = await fetch("http://localhost:8080/getall-activity", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setActivities(data);
    } catch (err) {
      console.error(err);
      alert("failed to fetch activites.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProgramStats = async () => {
    try {
      const res = await fetch(
        "http://localhost:8080/admin/program-output-count",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch chart data");
      }

      const data = await res.json();
      const outputData = data.outputCountData || [];
      const activityData = data.activityCountData || [];

      console.log("data ", data);
      const formattedOutputCountData = outputData.map((item) => ({
        program: item.programName,
        value: item.totalOutput,
      }));

      const formattedActivityData = activityData.map((item) => ({
        program: item.programName,
        value: item.activityCount,
      }));

      setProgramOutputCount(formattedOutputCountData);
      setProgramActivity(formattedActivityData);
    } catch (err) {
      console.error("Chart fetch error:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchActivities();
    fetchProgramStats();
  }, []);

  // Filter activities based on search query
  const filteredActivities = activities.filter((activity) => {
    return Object.keys(activity)
      .filter((key) => !excludedKeys.includes(key))
      .some((key) =>
        (activity[key] ?? "")
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      );
  });

  // export data
  const exportToCSV = () => {
    console.log("exporty");
  };

  if (loading) return <div>Loading activities...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Activity Logs</h1>
          <p className="text-muted-foreground mt-1">
            View all field activities across programs
          </p>
        </div>
        <Button variant="outline" onClick={exportToCSV}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {activities.length > 0 &&
                    Object.keys(activities[0])
                      .filter((key) => !excludedKeys.includes(key))
                      .map((key) => <TableHead key={key}>{key}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      {Object.keys(activity)
                        .filter((key) => !excludedKeys.includes(key))
                        .map((key) => (
                          <TableCell key={key}>
                            {activity[key]?.toString() ?? ""}
                          </TableCell>
                        ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={
                        activities[0]
                          ? Object.keys(activities[0]).length -
                            excludedKeys.length
                          : 1
                      }
                      className="text-center py-8 text-muted-foreground"
                    >
                      No activities found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-6">
        {/* Total Output Chart */}
        <BarChart
          title="Total Output per Program"
          description="Total output generated under each program"
          data={programOutputCount}
        />

        {/* Activity Count Chart */}
        <BarChart
          title="Activities per Program"
          description="Number of activity logs under each program"
          data={programActivity}
        />
      </div>
    </div>
  );
};

export default ActivityLogs;
