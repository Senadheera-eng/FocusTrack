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
  Grid,
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

// Styled Components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)",
}));

const StatsCard = styled(Card)(({ theme }) => ({
  background:
    "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)",
  backdropFilter: "blur(20px)",
  borderRadius: "16px",
  border: "1px solid rgba(102, 126, 234, 0.1)",
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(102, 126, 234, 0.2)",
  },
}));

const TaskCard = styled(Card)(({ theme }) => ({
  borderRadius: "16px",
  border: "1px solid rgba(102, 126, 234, 0.1)",
  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
  transition: "all 0.3s ease",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(102, 126, 234, 0.15)",
    borderColor: "rgba(102, 126, 234, 0.3)",
  },
}));

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
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700 }}>
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
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </StyledAppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "#1a202c", mb: 1 }}
          >
            Your Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your tasks and track your productivity
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: "12px",
                      bgcolor: "rgba(102, 126, 234, 0.1)",
                      mr: 2,
                    }}
                  >
                    <Assignment sx={{ color: "#667eea", fontSize: 28 }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {totalTasks}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Total Tasks
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: "12px",
                      bgcolor: "rgba(76, 175, 80, 0.1)",
                      mr: 2,
                    }}
                  >
                    <CheckCircle sx={{ color: "#4caf50", fontSize: 28 }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {completedTasks}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: "12px",
                      bgcolor: "rgba(255, 152, 0, 0.1)",
                      mr: 2,
                    }}
                  >
                    <TrendingUp sx={{ color: "#ff9800", fontSize: 28 }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {inProgressTasks}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  In Progress
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: "12px",
                      bgcolor: "rgba(158, 158, 158, 0.1)",
                      mr: 2,
                    }}
                  >
                    <AccessTime sx={{ color: "#9e9e9e", fontSize: 28 }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {todoTasks}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  To Do
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>
        </Grid>

        {/* Add Task Button */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a202c" }}>
            Your Tasks
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "12px",
              px: 3,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "0 4px 14px rgba(102, 126, 234, 0.4)",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
              },
            }}
          >
            Add Task
          </Button>
        </Box>

        {/* Loading State */}
        {loading && (
          <Grid container spacing={3}>
            {[1, 2, 3].map((i) => (
              <Grid size={{ xs: 12, md: 4 }} key={i}>
                <Card sx={{ borderRadius: "16px" }}>
                  <CardContent>
                    <Skeleton variant="text" height={32} />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Skeleton
                      variant="rectangular"
                      height={40}
                      sx={{ mt: 2 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
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
                border: "2px dashed rgba(102, 126, 234, 0.2)",
              }}
            >
              <CardContent>
                <Assignment
                  sx={{
                    fontSize: 80,
                    color: "rgba(102, 126, 234, 0.3)",
                    mb: 2,
                  }}
                />
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
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
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "12px",
                    px: 4,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Create Task
                </Button>
              </CardContent>
            </Card>
          </Fade>
        )}

        {/* Tasks Grid */}
        {!loading && !error && tasks.length > 0 && (
          <Grid container spacing={3}>
            {tasks.map((task) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={task.id}>
                <Fade in>
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
                            color: "#1a202c",
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
                          <Typography
                            variant="caption"
                            sx={{ color: "#4caf50" }}
                          >
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
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;
