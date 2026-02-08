import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Today,
  DateRange,
  Schedule,
  AccessTime,
} from "@mui/icons-material";
import { styled, keyframes } from "@mui/material/styles";

import Sidebar, { SIDEBAR_WIDTH } from "../components/Sidebar";
import StatsCard from "../components/StatsCard";
import ProductivityCharts from "../components/ProductivityCharts";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  dueDate?: string;
}

interface ProductivityStats {
  completedToday: number;
  completedThisWeek: number;
  hoursTrackedToday: number;
  hoursTrackedThisWeek: number;
  totalTasks: number;
  totalCompleted: number;
  totalInProgress: number;
  totalTodo: number;
  streakDays: number;
}

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const formatHours = (hours: number): string => {
  if (hours < 0.01) return "0m";
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

const getEmailFromToken = (): string => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return "";
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.email || payload.sub || "";
  } catch {
    return "";
  }
};

const AnalyticsPage: React.FC = () => {
  const { state, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [tasks, setTasks] = useState<Task[]>([]);
  const [prodStats, setProdStats] = useState<ProductivityStats | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userEmail = getEmailFromToken();

  useEffect(() => {
    if (state.isAuthenticated) {
      fetchTasks();
      fetchProductivityStats();
    }
  }, [state.isAuthenticated]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:4000/tasks");
      setTasks(res.data);
    } catch {
      // silent
    }
  };

  const fetchProductivityStats = async () => {
    try {
      const res = await axios.get("http://localhost:4000/time-entries/productivity-stats");
      setProdStats(res.data);
    } catch {
      // silent
    }
  };

  // Compute completion rate
  const completionRate = tasks.length > 0
    ? Math.round((tasks.filter((t) => t.status === "done").length / tasks.length) * 100)
    : 0;

  // Overdue tasks count
  const overdueTasks = tasks.filter(
    (t) => t.status !== "done" && t.dueDate && new Date(t.dueDate) < new Date()
  ).length;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <Sidebar
        userEmail={userEmail}
        onLogout={logout}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <Box
        sx={{
          flex: 1,
          ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` },
          minHeight: "100vh",
          transition: "margin 0.3s ease",
        }}
      >
        {isMobile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              px: 2,
              py: 1.5,
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(12px)",
              borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
              position: "sticky",
              top: 0,
              zIndex: 100,
            }}
          >
            <IconButton
              onClick={() => setMobileMenuOpen(true)}
              sx={{ mr: 1, color: "#0891b2" }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "18px",
                background: "linear-gradient(135deg, #00d4d4, #0891b2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              FocusTrack
            </Typography>
          </Box>
        )}

        <Box sx={{ p: { xs: 2.5, sm: 3, md: 4, lg: 5 }, maxWidth: "1400px" }}>
          {/* Page Title */}
          <Box
            sx={{
              mb: 4,
              animation: `${fadeInUp} 0.5s ease-out`,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#0f172a",
                mb: 0.5,
                fontSize: { xs: "1.5rem", md: "2rem" },
                letterSpacing: "-0.5px",
              }}
            >
              Analytics
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#64748b", fontSize: "15px" }}
            >
              Track your productivity and task insights
            </Typography>
          </Box>

          {/* Productivity Stats */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: { xs: 2, md: 3 },
              mb: 4,
              animation: `${fadeInUp} 0.5s ease-out`,
              animationDelay: "0.1s",
              animationFillMode: "both",
            }}
          >
            <StatsCard
              icon={Today}
              value={prodStats?.completedToday ?? 0}
              label="Completed Today"
              color="#10b981"
              bgColor="rgba(16, 185, 129, 0.1)"
            />
            <StatsCard
              icon={DateRange}
              value={prodStats?.completedThisWeek ?? 0}
              label="Completed This Week"
              color="#0891b2"
              bgColor="rgba(8, 145, 178, 0.1)"
            />
            <StatsCard
              icon={Schedule}
              value={formatHours(prodStats?.hoursTrackedToday ?? 0)}
              label="Hours Today"
              color="#f59e0b"
              bgColor="rgba(245, 158, 11, 0.1)"
            />
            <StatsCard
              icon={AccessTime}
              value={formatHours(prodStats?.hoursTrackedThisWeek ?? 0)}
              label="Hours This Week"
              color="#8b5cf6"
              bgColor="rgba(139, 92, 246, 0.1)"
            />
          </Box>

          {/* Summary Cards */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
              gap: { xs: 2, md: 3 },
              mb: 4,
              animation: `${fadeInUp} 0.5s ease-out`,
              animationDelay: "0.15s",
              animationFillMode: "both",
            }}
          >
            <Box
              sx={{
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(16px)",
                borderRadius: "18px",
                border: "1px solid rgba(255, 255, 255, 0.8)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                p: 3,
                textAlign: "center",
              }}
            >
              <Typography sx={{ fontSize: "36px", fontWeight: 800, color: "#0891b2" }}>
                {completionRate}%
              </Typography>
              <Typography sx={{ fontSize: "13px", color: "#64748b", fontWeight: 600 }}>
                Completion Rate
              </Typography>
            </Box>
            <Box
              sx={{
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(16px)",
                borderRadius: "18px",
                border: "1px solid rgba(255, 255, 255, 0.8)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                p: 3,
                textAlign: "center",
              }}
            >
              <Typography sx={{ fontSize: "36px", fontWeight: 800, color: "#10b981" }}>
                {prodStats?.streakDays ?? 0}
              </Typography>
              <Typography sx={{ fontSize: "13px", color: "#64748b", fontWeight: 600 }}>
                Day Streak
              </Typography>
            </Box>
            <Box
              sx={{
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(16px)",
                borderRadius: "18px",
                border: "1px solid rgba(255, 255, 255, 0.8)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                p: 3,
                textAlign: "center",
              }}
            >
              <Typography sx={{ fontSize: "36px", fontWeight: 800, color: overdueTasks > 0 ? "#ef4444" : "#94a3b8" }}>
                {overdueTasks}
              </Typography>
              <Typography sx={{ fontSize: "13px", color: "#64748b", fontWeight: 600 }}>
                Overdue Tasks
              </Typography>
            </Box>
          </Box>

          {/* Charts */}
          <Box
            sx={{
              animation: `${fadeInUp} 0.5s ease-out`,
              animationDelay: "0.2s",
              animationFillMode: "both",
            }}
          >
            <ProductivityCharts tasks={tasks} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AnalyticsPage;
