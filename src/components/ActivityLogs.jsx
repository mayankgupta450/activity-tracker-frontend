import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const ActivityLogs = () => {
  const { user } = useAuth();
  const token = user?.token;
  const [programStats, setProgramStats] = useState([
    { program: "Health Check", output: 10 },
    { program: "Nutrition", output: 5 },
  ]);

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
  

  useEffect(() => {
    fetchActivities();
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

      {/* -------------------------------
       */}
      <div className="space-y-6">
        {/* Chart */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">
              Program having how many output count
            </CardTitle>
            <CardDescription>
              Total output generated under each program
            </CardDescription>
          </CardHeader>

          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading chart...</p>
            ) : programStats.length === 0 ? (
              <p className="text-muted-foreground">No data available</p>
            ) : (
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={programStats}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 60, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                      dataKey="program"
                      type="category"
                      width={150}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="output"
                      fill="hsl(var(--primary))"
                      radius={[0, 6, 6, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActivityLogs;
