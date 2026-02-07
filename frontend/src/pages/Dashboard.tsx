import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { format } from "date-fns";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Chip,
  AppBar,
  Toolbar,
  Fade,
  Skeleton,
  Alert,
  Stack,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  CheckCircle,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Logout as LogoutIcon,
  Timer as TimerIcon,
  TrendingUp,
  Assignment,
  AccessTime,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// Styled Components with Teal Theme
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: "linear-gradient(135deg, #00d4d4 0%, #00a8a8 100%)",
  boxShadow: "0 4px 20px rgba(0, 212, 212, 0.3)",
}));

const StatsCard = styled(Card)(({ theme }) => ({
  background:
    "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 1) 100%)",
  backdropFilter: "blur(20px)",
  borderRadius: "16px",
  border: "1px solid rgba(0, 212, 212, 0.1)",
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(0, 212, 212, 0.2)",
  },
}));

const TaskCard = styled(Card)(({ theme }) => ({
  borderRadius: "16px",
  border: "1px solid rgba(0, 212, 212, 0.15)",
  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
  transition: "all 0.3s ease",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(0, 212, 212, 0.2)",
    borderColor: "rgba(0, 212, 212, 0.4)",
  },
}));

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
    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:4000/tasks");
        setTasks(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    if (state.isAuthenticated) {
      fetchTasks();
    }
  }, [state.isAuthenticated]);

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

  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "in_progress",
  ).length;
  const todoTasks = tasks.filter((t) => t.status === "todo").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "success";
      case "in_progress":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "todo":
        return "To Do";
      case "in_progress":
        return "In Progress";
      case "done":
        return "Completed";
      default:
        return status;
    }
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
      {/* App Bar */}
      <StyledAppBar position="static" elevation={0}>
        <Toolbar>
          <Typography
            variant="h5"
            sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: "0.5px" }}
          >
            FocusTrack
          </Typography>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={logout}
            sx={{
              borderRadius: "12px",
              px: 3,
              textTransform: "none",
              fontWeight: 600,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                transform: "translateY(-2px)",
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </StyledAppBar>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        {/* Header */}
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
          <StatsCard>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "12px",
                    background:
                      "linear-gradient(135deg, #00d4d4 0%, #00a8a8 100%)",
                    mr: 2,
                  }}
                >
                  <Assignment sx={{ color: "white", fontSize: 28 }} />
                </Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "#2d3748" }}
                >
                  {totalTasks}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                Total Tasks
              </Typography>
            </CardContent>
          </StatsCard>

          <StatsCard>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "12px",
                    bgcolor: "rgba(76, 175, 80, 0.15)",
                    mr: 2,
                  }}
                >
                  <CheckCircle sx={{ color: "#4caf50", fontSize: 28 }} />
                </Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "#2d3748" }}
                >
                  {completedTasks}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                Completed
              </Typography>
            </CardContent>
          </StatsCard>

          <StatsCard>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "12px",
                    bgcolor: "rgba(255, 152, 0, 0.15)",
                    mr: 2,
                  }}
                >
                  <TrendingUp sx={{ color: "#ff9800", fontSize: 28 }} />
                </Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "#2d3748" }}
                >
                  {inProgressTasks}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                In Progress
              </Typography>
            </CardContent>
          </StatsCard>

          <StatsCard>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "12px",
                    bgcolor: "rgba(158, 158, 158, 0.15)",
                    mr: 2,
                  }}
                >
                  <AccessTime sx={{ color: "#9e9e9e", fontSize: 28 }} />
                </Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "#2d3748" }}
                >
                  {todoTasks}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                To Do
              </Typography>
            </CardContent>
          </StatsCard>
        </Box>

        {/* Add Task Button */}
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
          <AddTaskButton variant="contained" startIcon={<AddIcon />}>
            Add New Task
          </AddTaskButton>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {[1, 2, 3].map((i) => (
              <Card sx={{ borderRadius: "16px" }} key={i}>
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="rectangular" height={40} sx={{ mt: 2 }} />
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert
            severity="error"
            sx={{ borderRadius: "12px", mb: 3 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Empty State */}
        {!loading && !error && tasks.length === 0 && (
          <Fade in>
            <Card
              sx={{
                borderRadius: "16px",
                textAlign: "center",
                py: 8,
                border: "2px dashed rgba(0, 212, 212, 0.3)",
                background:
                  "linear-gradient(135deg, rgba(0, 212, 212, 0.02) 0%, rgba(0, 212, 212, 0.05) 100%)",
              }}
            >
              <CardContent>
                <Assignment
                  sx={{ fontSize: 80, color: "rgba(0, 212, 212, 0.3)", mb: 2 }}
                />
                <Typography
                  variant="h6"
                  sx={{ mb: 1, fontWeight: 600, color: "#2d3748" }}
                >
                  No tasks yet
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Create your first task to get started on your productivity
                  journey
                </Typography>
                <AddTaskButton variant="contained" startIcon={<AddIcon />}>
                  Create Task
                </AddTaskButton>
              </CardContent>
            </Card>
          </Fade>
        )}

        {/* Tasks Grid */}
        {!loading && !error && tasks.length > 0 && (
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
              <Fade in key={task.id}>
                <TaskCard>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: "#2d3748",
                          lineHeight: 1.3,
                          flex: 1,
                        }}
                      >
                        {task.title}
                      </Typography>
                      <Chip
                        label={getStatusLabel(task.status)}
                        color={getStatusColor(task.status)}
                        size="small"
                        sx={{ ml: 1, fontWeight: 600 }}
                      />
                    </Box>

                    {task.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {task.description}
                      </Typography>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Stack spacing={1}>
                      <Typography variant="caption" color="text.secondary">
                        Created:{" "}
                        {format(new Date(task.createdAt), "MMM d, yyyy")}
                      </Typography>
                      {task.completedAt && (
                        <Typography variant="caption" sx={{ color: "#4caf50" }}>
                          Completed:{" "}
                          {format(new Date(task.completedAt), "MMM d, yyyy")}
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    {task.status !== "done" && (
                      <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircle />}
                        onClick={() => handleMarkComplete(task.id)}
                        sx={{
                          borderRadius: "10px",
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        Complete
                      </Button>
                    )}
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(task.id)}
                      sx={{
                        "&:hover": {
                          bgcolor: "rgba(244, 67, 54, 0.1)",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </TaskCard>
              </Fade>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;
