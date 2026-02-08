import React from "react";
import { Box, Typography } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Task {
  id: string;
  title: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
}

interface ProductivityChartsProps {
  tasks: Task[];
}

const STATUS_COLORS: Record<string, string> = {
  todo: "#8b5cf6",
  in_progress: "#f59e0b",
  done: "#10b981",
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "#94a3b8",
  medium: "#f59e0b",
  high: "#ef4444",
};

const cardStyle = {
  background: "rgba(255, 255, 255, 0.7)",
  backdropFilter: "blur(16px)",
  borderRadius: "18px",
  border: "1px solid rgba(255, 255, 255, 0.8)",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
  p: 3,
  height: "100%",
};

const ProductivityCharts: React.FC<ProductivityChartsProps> = ({ tasks }) => {
  // Status distribution data
  const statusData = [
    { name: "To Do", value: tasks.filter((t) => t.status === "todo").length },
    { name: "In Progress", value: tasks.filter((t) => t.status === "in_progress").length },
    { name: "Done", value: tasks.filter((t) => t.status === "done").length },
  ].filter((d) => d.value > 0);

  // Priority distribution data
  const priorityData = [
    { name: "High", count: tasks.filter((t) => t.priority === "high").length, fill: PRIORITY_COLORS.high },
    { name: "Medium", count: tasks.filter((t) => t.priority === "medium").length, fill: PRIORITY_COLORS.medium },
    { name: "Low", count: tasks.filter((t) => t.priority === "low").length, fill: PRIORITY_COLORS.low },
  ];

  if (tasks.length === 0) return null;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: { xs: 2, md: 3 },
        mb: 4,
      }}
    >
      {/* Status Pie Chart */}
      <Box sx={cardStyle}>
        <Typography
          sx={{ fontWeight: 700, color: "#0f172a", fontSize: "15px", mb: 2 }}
        >
          Task Status Distribution
        </Typography>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
              strokeWidth={0}
            >
              {statusData.map((entry) => {
                const key =
                  entry.name === "To Do"
                    ? "todo"
                    : entry.name === "In Progress"
                      ? "in_progress"
                      : "done";
                return <Cell key={entry.name} fill={STATUS_COLORS[key]} />;
              })}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                fontSize: "13px",
              }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "12px", color: "#64748b" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Priority Bar Chart */}
      <Box sx={cardStyle}>
        <Typography
          sx={{ fontWeight: 700, color: "#0f172a", fontSize: "15px", mb: 2 }}
        >
          Tasks by Priority
        </Typography>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={priorityData} barSize={36}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                fontSize: "13px",
              }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {priorityData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default ProductivityCharts;
