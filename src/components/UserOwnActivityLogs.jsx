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

const UserOwnActivityLogs = () => {
  const { user,settingUserId } = useAuth();
  const token = user?.token;

  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Keys not to display
  const excludedKeys = ["id", "programId", "user"];

  // Fetch user-specific activities
  const fetchActivities = async () => {
    console.log("users ", user);
    try {
      const res = await fetch(`http://localhost:8080/user/${settingUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setActivities(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch activities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Filter based on search query
  const filteredActivities = activities.filter((activity) =>
    Object.keys(activity)
      .filter((key) => !excludedKeys.includes(key))
      .some((key) =>
        (activity[key] ?? "")
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      ),
  );

  if (loading) return <div>Loading activities...</div>;

  return (
    <div className="space-y-6">
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
                            {key === "program"
                              ? activity.program?.name
                              : (activity[key]?.toString() ?? "")}
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
    </div>
  );
};

export default UserOwnActivityLogs;
