import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Alert,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Add as AddIcon,
  Assignment,
  CheckCircle,
  TrendingUp,
  AccessTime,
  Menu as MenuIcon,
  Today,
  DateRange,
  LocalFireDepartment,
  Schedule,
} from "@mui/icons-material";
import { styled, keyframes } from "@mui/material/styles";

// Import components
import Sidebar, { SIDEBAR_WIDTH } from "../components/Sidebar";
import StatsCard from "../components/StatsCard";
import TaskCard from "../components/TaskCard";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import AddTaskModal from "../components/AddTaskModal";
import EditTaskModal from "../components/EditTaskModal";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
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

// ======================== ANIMATIONS ========================

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ======================== STYLED COMPONENTS ========================

const AddTaskButton = styled(Button)({
  background: "linear-gradient(135deg, #00d4d4 0%, #0891b2 100%)",
  borderRadius: "14px",
  padding: "12px 28px",
  textTransform: "none",
  fontWeight: 700,
  fontSize: "14px",
  letterSpacing: "0.3px",
  boxShadow: "0 4px 14px rgba(0, 212, 212, 0.3)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    background: "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(0, 212, 212, 0.4)",
  },
});

const FilterChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== "selected",
})<{ selected?: boolean }>(({ selected }) => ({
  padding: "8px 20px",
  borderRadius: "50px",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  whiteSpace: "nowrap" as const,
  ...(selected
    ? {
        background: "linear-gradient(135deg, #00d4d4 0%, #0891b2 100%)",
        color: "white",
        boxShadow: "0 4px 14px rgba(0, 212, 212, 0.3)",
      }
    : {
        background: "rgba(0, 0, 0, 0.04)",
        color: "#64748b",
        "&:hover": {
          background: "rgba(0, 212, 212, 0.08)",
          color: "#0891b2",
        },
      }),
}));

// ======================== HELPERS ========================

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

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const formatHours = (hours: number): string => {
  if (hours < 0.01) return "0m";
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

// ======================== COMPONENT ========================

const Dashboard: React.FC = () => {
  const { state, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "todo" | "in_progress" | "done">("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prodStats, setProdStats] = useState<ProductivityStats | null>(null);

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const userEmail = getEmailFromToken();

  useEffect(() => {
    fetchTasks();
    fetchProductivityStats();
  }, [state.isAuthenticated]);

  const fetchTasks = async () => {
    if (!state.isAuthenticated) return;

    try {
      const res = await axios.get("http://localhost:4000/tasks");
      setTasks(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductivityStats = async () => {
    if (!state.isAuthenticated) return;
    try {
      const res = await axios.get("http://localhost:4000/time-entries/productivity-stats");
      setProdStats(res.data);
    } catch {
      // Stats are non-critical, fail silently
    }
  };

  const handleMarkComplete = async (id: string) => {
    try {
      await axios.patch(`http://localhost:4000/tasks/${id}`, {
        status: "done",
      });
      setTasks(
        tasks.map((t) =>
          t.id === id
            ? { ...t, status: "done", completedAt: new Date().toISOString() }
            : t,
        ),
      );
      fetchProductivityStats();
    } catch {
      alert("Failed to update task");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await axios.delete(`http://localhost:4000/tasks/${id}`);
      setTasks(tasks.filter((t) => t.id !== id));
      fetchProductivityStats();
    } catch {
      alert("Failed to delete task");
    }
  };

  const handleAddTask = () => {
    setAddModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    setEditModalOpen(true);
  };

  // Calculate stats
  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "done").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    todo: tasks.filter((t) => t.status === "todo").length,
  };

  // Filtered tasks
  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  if (!state.isAuthenticated) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Redirecting...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      {/* Sidebar */}
      <Sidebar
        userEmail={userEmail}
        onLogout={logout}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` },
          minHeight: "100vh",
          transition: "margin 0.3s ease",
        }}
      >
        {/* Top Bar (Mobile) */}
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

        {/* Content Area */}
        <Box sx={{ p: { xs: 2.5, sm: 3, md: 4, lg: 5 }, maxWidth: "1400px" }}>
          {/* Greeting */}
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
              {getGreeting()},{" "}
              <Box
                component="span"
                sx={{
                  background: "linear-gradient(135deg, #00d4d4, #0891b2)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {userEmail ? userEmail.split("@")[0] : "User"}
              </Box>
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#64748b", fontSize: "15px" }}
            >
              Here's what's happening with your tasks today
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
              mb: 3,
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

          {/* Task Overview Stats */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(4, 1fr)",
              },
              gap: { xs: 2, md: 3 },
              mb: 4,
              animation: `${fadeInUp} 0.5s ease-out`,
              animationDelay: "0.15s",
              animationFillMode: "both",
            }}
          >
            <StatsCard
              icon={Assignment}
              value={stats.total}
              label="Total Tasks"
              color="#0891b2"
              bgColor="rgba(8, 145, 178, 0.1)"
            />
            <StatsCard
              icon={CheckCircle}
              value={stats.completed}
              label="Completed"
              color="#10b981"
              bgColor="rgba(16, 185, 129, 0.1)"
            />
            <StatsCard
              icon={TrendingUp}
              value={stats.inProgress}
              label="In Progress"
              color="#f59e0b"
              bgColor="rgba(245, 158, 11, 0.1)"
            />
            {prodStats && prodStats.streakDays > 0 ? (
              <StatsCard
                icon={LocalFireDepartment}
                value={`${prodStats.streakDays}d`}
                label="Streak"
                color="#ef4444"
                bgColor="rgba(239, 68, 68, 0.1)"
              />
            ) : (
              <StatsCard
                icon={AccessTime}
                value={stats.todo}
                label="To Do"
                color="#8b5cf6"
                bgColor="rgba(139, 92, 246, 0.1)"
              />
            )}
          </Box>

          {/* Tasks Header + Filters */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", sm: "center" },
              gap: 2,
              mb: 3,
              animation: `${fadeInUp} 0.5s ease-out`,
              animationDelay: "0.2s",
              animationFillMode: "both",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#0f172a", mr: 1 }}
              >
                Tasks
              </Typography>
              <FilterChip
                selected={filter === "all"}
                onClick={() => setFilter("all")}
              >
                All ({stats.total})
              </FilterChip>
              <FilterChip
                selected={filter === "todo"}
                onClick={() => setFilter("todo")}
              >
                To Do ({stats.todo})
              </FilterChip>
              <FilterChip
                selected={filter === "in_progress"}
                onClick={() => setFilter("in_progress")}
              >
                In Progress ({stats.inProgress})
              </FilterChip>
              <FilterChip
                selected={filter === "done"}
                onClick={() => setFilter("done")}
              >
                Done ({stats.completed})
              </FilterChip>
            </Box>
            <AddTaskButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddTask}
            >
              Add Task
            </AddTaskButton>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{
                borderRadius: "14px",
                mb: 3,
                backdropFilter: "blur(8px)",
                background: "rgba(239, 68, 68, 0.06)",
                border: "1px solid rgba(239, 68, 68, 0.15)",
              }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {/* Content States */}
          {loading ? (
            <LoadingState />
          ) : filteredTasks.length === 0 ? (
            filter === "all" ? (
              <EmptyState onAddTask={handleAddTask} />
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  animation: `${fadeInUp} 0.4s ease-out`,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: "#94a3b8", fontWeight: 600 }}
                >
                  No tasks in this category
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#cbd5e1", mt: 1 }}
                >
                  Try selecting a different filter
                </Typography>
              </Box>
            )
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                },
                gap: { xs: 2, md: 3 },
              }}
            >
              {filteredTasks.map((task, index) => (
                <Box
                  key={task.id}
                  sx={{
                    animation: `${fadeInUp} 0.4s ease-out`,
                    animationDelay: `${index * 0.05}s`,
                    animationFillMode: "both",
                  }}
                >
                  <TaskCard
                    task={task}
                    onMarkComplete={handleMarkComplete}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Modals */}
      <AddTaskModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onTaskAdded={() => { fetchTasks(); fetchProductivityStats(); }}
      />
      <EditTaskModal
        open={editModalOpen}
        task={taskToEdit}
        onClose={() => {
          setEditModalOpen(false);
          setTaskToEdit(null);
        }}
        onTaskUpdated={() => { fetchTasks(); fetchProductivityStats(); }}
      />
    </Box>
  );
};

export default Dashboard;
