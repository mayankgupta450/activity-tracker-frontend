import React, { useEffect, useState } from "react";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const BarChart = ({ title, description, data }) => {
    useEffect(()=>{
        console.log("data inchart ",data);
    },[])
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-lg">
         {title}
        </CardTitle>
        <CardDescription>
         {description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <ReBarChart
              data={data}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 60, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                domain={[0, 10]}
                tickCount={11}
                allowDecimals={false}
              />
              <YAxis
                dataKey="program"
                type="category"
                width={150}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="hsl(var(--primary))"
                radius={[0, 6, 6, 0]}
              />
            </ReBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarChart;
