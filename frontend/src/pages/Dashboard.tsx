import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Box, Container, Typography, Button, Alert } from "@mui/material";
import {
  Add as AddIcon,
  Assignment,
  CheckCircle,
  TrendingUp,
  AccessTime,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Import components
import DashboardHeader from "../components/DashboardHeader";
import StatsCard from "../components/StatsCard";
import TaskCard from "../components/TaskCard";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

const AddTaskButton = styled(Button)({
  background: "linear-gradient(135deg, #00d4d4 0%, #00a8a8 100%)",
  borderRadius: "12px",
  padding: "12px 32px",
  textTransform: "none",
  fontWeight: 600,
  boxShadow: "0 4px 14px rgba(0, 212, 212, 0.4)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(135deg, #00a8a8 0%, #008888 100%)",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(0, 212, 212, 0.5)",
  },
});

const Dashboard: React.FC = () => {
  const { state, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
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
    } catch (err) {
      alert("Failed to update task");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await axios.delete(`http://localhost:4000/tasks/${id}`);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      alert("Failed to delete task");
    }
  };

  const handleAddTask = () => {
    // TODO: Open add task modal
    alert("Add task modal coming soon!");
  };

  // Calculate stats
  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "done").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    todo: tasks.filter((t) => t.status === "todo").length,
  };

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
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      {/* Header */}
      <DashboardHeader onLogout={logout} />

      <Container maxWidth="lg" sx={{ py: 5 }}>
        {/* Page Title */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "#2d3748",
              mb: 1,
              background: "linear-gradient(135deg, #00d4d4 0%, #00a8a8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Your Dashboard
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: "16px" }}
          >
            Manage your tasks and track your productivity journey
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
            mb: 5,
          }}
        >
          <StatsCard
            icon={Assignment}
            value={stats.total}
            label="Total Tasks"
            iconBgColor="linear-gradient(135deg, #00d4d4 0%, #00a8a8 100%)"
            iconColor="white"
          />
          <StatsCard
            icon={CheckCircle}
            value={stats.completed}
            label="Completed"
            iconBgColor="rgba(76, 175, 80, 0.15)"
            iconColor="#4caf50"
          />
          <StatsCard
            icon={TrendingUp}
            value={stats.inProgress}
            label="In Progress"
            iconBgColor="rgba(255, 152, 0, 0.15)"
            iconColor="#ff9800"
          />
          <StatsCard
            icon={AccessTime}
            value={stats.todo}
            label="To Do"
            iconBgColor="rgba(158, 158, 158, 0.15)"
            iconColor="#9e9e9e"
          />
        </Box>

        {/* Tasks Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#2d3748" }}>
            Your Tasks
          </Typography>
          <AddTaskButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddTask}
          >
            Add New Task
          </AddTaskButton>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            sx={{ borderRadius: "12px", mb: 3 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Content States */}
        {loading ? (
          <LoadingState />
        ) : tasks.length === 0 ? (
          <EmptyState onAddTask={handleAddTask} />
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onMarkComplete={handleMarkComplete}
                onDelete={handleDelete}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;
