import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Alert,
  IconButton,
  Badge,
  Popover,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Add as AddIcon,
  Assignment,
  CheckCircle,
  TrendingUp,
  Menu as MenuIcon,
  Today,
  Search as SearchIcon,
  Close as CloseIcon,
  FileDownload as ExportIcon,
  NotificationsNone as BellIcon,
  AccessTime as ClockIcon,
  ArrowDownward,
  ArrowUpward,
  CalendarMonth,
  PriorityHigh,
  SortByAlpha,
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
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  dueDate?: string;
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

const SortChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean }>(({ active }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "6px 14px",
  borderRadius: "10px",
  fontSize: "12.5px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  whiteSpace: "nowrap" as const,
  userSelect: "none" as const,
  ...(active
    ? {
        background: "linear-gradient(135deg, #00d4d4 0%, #0891b2 100%)",
        color: "white",
        boxShadow: "0 3px 10px rgba(0, 212, 212, 0.25)",
      }
    : {
        background: "rgba(0, 0, 0, 0.04)",
        color: "#94a3b8",
        border: "1px solid transparent",
        "&:hover": {
          background: "rgba(8, 145, 178, 0.06)",
          color: "#0891b2",
        },
      }),
}));

// ======================== SORT OPTIONS ========================

type SortKey = "newest" | "oldest" | "dueDate" | "priority" | "title";

const SORT_OPTIONS: { key: SortKey; label: string; icon: React.ElementType }[] = [
  { key: "newest", label: "Newest", icon: ArrowDownward },
  { key: "oldest", label: "Oldest", icon: ArrowUpward },
  { key: "dueDate", label: "Due Date", icon: CalendarMonth },
  { key: "priority", label: "Priority", icon: PriorityHigh },
  { key: "title", label: "A-Z", icon: SortByAlpha },
];

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

// ======================== COMPONENT ========================

const Dashboard: React.FC = () => {
  const { state, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "todo" | "in_progress" | "done">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bellAnchor, setBellAnchor] = useState<HTMLElement | null>(null);

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const userEmail = getEmailFromToken();

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
    } catch {
      alert("Failed to update task");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await axios.delete(`http://localhost:4000/tasks/${id}`);
      setTasks(tasks.filter((t) => t.id !== id));
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

  const handleExportCSV = () => {
    if (tasks.length === 0) return;
    const headers = ["Title", "Description", "Status", "Priority", "Due Date", "Created At", "Completed At"];
    const rows = tasks.map((t) => [
      `"${t.title.replace(/"/g, '""')}"`,
      `"${(t.description || "").replace(/"/g, '""')}"`,
      t.status,
      t.priority,
      t.dueDate ? new Date(t.dueDate).toLocaleString() : "",
      new Date(t.createdAt).toLocaleString(),
      t.completedAt ? new Date(t.completedAt).toLocaleString() : "",
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `focustrack-tasks-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Calculate stats
  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "done").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    todo: tasks.filter((t) => t.status === "todo").length,
  };

  // Reminders: overdue + due today
  const reminders = tasks.filter((t) => {
    if (t.status === "done" || !t.dueDate) return false;
    const now = new Date();
    const due = new Date(t.dueDate);
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    return due <= todayEnd;
  });

  // Filtered and sorted tasks
  const filteredTasks = tasks
    .filter((t) => {
      const matchesFilter = filter === "all" || t.status === filter;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        t.title.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query));
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "dueDate": {
          // Tasks with due dates first, sorted ascending; tasks without due dates last
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        case "priority": {
          const order = { high: 0, medium: 1, low: 2 };
          return order[a.priority] - order[b.priority];
        }
        case "title":
          return a.title.localeCompare(b.title);
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

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
          {/* Row 1: Greeting + Export/Bell */}
          <Box
            sx={{
              mb: 4,
              animation: `${fadeInUp} 0.5s ease-out`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
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

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* Export Button */}
              <IconButton
                onClick={handleExportCSV}
                disabled={tasks.length === 0}
                sx={{
                  color: "#64748b",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  borderRadius: "12px",
                  width: 44,
                  height: 44,
                  background: "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(8px)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#0891b2",
                    borderColor: "#0891b2",
                    background: "rgba(8, 145, 178, 0.06)",
                  },
                }}
                title="Export CSV"
              >
                <ExportIcon sx={{ fontSize: 20 }} />
              </IconButton>

              {/* Notification Bell */}
              <IconButton
                onClick={(e) => setBellAnchor(bellAnchor ? null : e.currentTarget)}
                sx={{
                  color: reminders.length > 0 ? "#f59e0b" : "#94a3b8",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  borderRadius: "12px",
                  width: 44,
                  height: 44,
                  background: "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(8px)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#0891b2",
                    color: "#0891b2",
                  },
                }}
              >
                <Badge
                  badgeContent={reminders.length}
                  color="error"
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: "10px",
                      height: "18px",
                      minWidth: "18px",
                    },
                  }}
                >
                  <BellIcon sx={{ fontSize: 22 }} />
                </Badge>
              </IconButton>

              <Popover
                open={Boolean(bellAnchor)}
                anchorEl={bellAnchor}
                onClose={() => setBellAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                  paper: {
                    sx: {
                      borderRadius: "16px",
                      boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                      border: "1px solid rgba(255,255,255,0.8)",
                      backdropFilter: "blur(20px)",
                      background: "rgba(255,255,255,0.95)",
                      width: 340,
                      maxHeight: 400,
                      overflow: "auto",
                      mt: 1,
                    },
                  },
                }}
              >
                <Box sx={{ p: 2.5 }}>
                  <Typography sx={{ fontWeight: 700, color: "#0f172a", fontSize: "15px", mb: 2 }}>
                    Reminders ({reminders.length})
                  </Typography>
                  {reminders.length === 0 ? (
                    <Typography sx={{ color: "#94a3b8", fontSize: "13px", textAlign: "center", py: 3 }}>
                      No pending reminders
                    </Typography>
                  ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      {reminders.map((t) => {
                        const isOverdue = new Date(t.dueDate!) < new Date(new Date().toDateString());
                        return (
                          <Box
                            key={t.id}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                              px: 2,
                              py: 1.5,
                              borderRadius: "12px",
                              background: "rgba(248, 250, 252, 0.6)",
                              borderLeft: `3px solid ${isOverdue ? "#ef4444" : "#f59e0b"}`,
                            }}
                          >
                            <ClockIcon sx={{ fontSize: 16, color: isOverdue ? "#ef4444" : "#f59e0b" }} />
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                sx={{
                                  fontSize: "13px",
                                  fontWeight: 600,
                                  color: "#0f172a",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {t.title}
                              </Typography>
                            </Box>
                            <Chip
                              label={isOverdue ? "Overdue" : "Today"}
                              size="small"
                              sx={{
                                fontWeight: 700,
                                fontSize: "9px",
                                height: "20px",
                                color: isOverdue ? "#ef4444" : "#f59e0b",
                                backgroundColor: isOverdue ? "rgba(239,68,68,0.08)" : "rgba(245,158,11,0.08)",
                                "& .MuiChip-label": { px: 0.75 },
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </Box>
              </Popover>
            </Box>
          </Box>

          {/* Stats Row - 4 cards */}
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
              animationDelay: "0.1s",
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
              icon={Today}
              value={stats.todo}
              label="To Do"
              color="#8b5cf6"
              bgColor="rgba(139, 92, 246, 0.1)"
            />
            <StatsCard
              icon={TrendingUp}
              value={stats.inProgress}
              label="In Progress"
              color="#f59e0b"
              bgColor="rgba(245, 158, 11, 0.1)"
            />
            <StatsCard
              icon={CheckCircle}
              value={stats.completed}
              label="Completed"
              color="#10b981"
              bgColor="rgba(16, 185, 129, 0.1)"
            />
          </Box>

          {/* Toolbar Row 1: Title + Search + Add */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", sm: "center" },
              gap: 2,
              mb: 2,
              animation: `${fadeInUp} 0.5s ease-out`,
              animationDelay: "0.15s",
              animationFillMode: "both",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#0f172a" }}
            >
              Tasks
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {/* Search */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  background: "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(8px)",
                  borderRadius: "12px",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  px: 1.5,
                  py: 0.5,
                  transition: "all 0.3s ease",
                  "&:focus-within": {
                    borderColor: "#0891b2",
                    boxShadow: "0 2px 12px rgba(8, 145, 178, 0.1)",
                    background: "rgba(255, 255, 255, 0.95)",
                  },
                }}
              >
                <SearchIcon sx={{ color: "#94a3b8", fontSize: 20, mr: 1 }} />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: "13.5px",
                    color: "#0f172a",
                    width: "160px",
                    fontFamily: "inherit",
                  }}
                />
                {searchQuery && (
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery("")}
                    sx={{ color: "#94a3b8", p: 0.25, "&:hover": { color: "#64748b" } }}
                  >
                    <CloseIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                )}
              </Box>
              <AddTaskButton
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddTask}
              >
                Add Task
              </AddTaskButton>
            </Box>
          </Box>

          {/* Toolbar Row 2: Filters + Sort Chips */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2,
              mb: 3,
              animation: `${fadeInUp} 0.5s ease-out`,
              animationDelay: "0.18s",
              animationFillMode: "both",
            }}
          >
            {/* Filter Chips */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }}>
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

            {/* Sort Chips */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }}>
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#94a3b8",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  mr: 0.5,
                }}
              >
                Sort
              </Typography>
              {SORT_OPTIONS.map((opt) => (
                <SortChip
                  key={opt.key}
                  active={sortBy === opt.key}
                  onClick={() => setSortBy(opt.key)}
                >
                  <opt.icon sx={{ fontSize: 14 }} />
                  {opt.label}
                </SortChip>
              ))}
            </Box>
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
            filter === "all" && !searchQuery ? (
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
                  {searchQuery ? "No tasks match your search" : "No tasks in this category"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#cbd5e1", mt: 1 }}
                >
                  {searchQuery ? "Try a different search term" : "Try selecting a different filter"}
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
        onTaskAdded={() => { fetchTasks();}}
      />
      <EditTaskModal
        open={editModalOpen}
        task={taskToEdit}
        onClose={() => {
          setEditModalOpen(false);
          setTaskToEdit(null);
        }}
        onTaskUpdated={() => { fetchTasks();}}
      />
    </Box>
  );
};

export default Dashboard;
