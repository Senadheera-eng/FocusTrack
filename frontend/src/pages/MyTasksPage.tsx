import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight,
  CalendarToday,
  AccessTime as ClockIcon,
} from "@mui/icons-material";
import { keyframes } from "@mui/material/styles";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, isToday } from "date-fns";

import Sidebar, { SIDEBAR_WIDTH } from "../components/Sidebar";

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

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

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

const getPriorityColor = (p: string) => {
  switch (p) {
    case "high": return "#ef4444";
    case "low": return "#94a3b8";
    default: return "#f59e0b";
  }
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case "done":
      return { label: "Done", color: "#10b981", bg: "rgba(16, 185, 129, 0.08)" };
    case "in_progress":
      return { label: "In Progress", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.08)" };
    default:
      return { label: "To Do", color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.08)" };
  }
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MyTasksPage: React.FC = () => {
  const { state, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [tasks, setTasks] = useState<Task[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const userEmail = getEmailFromToken();

  useEffect(() => {
    if (state.isAuthenticated) fetchTasks();
  }, [state.isAuthenticated]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:4000/tasks");
      setTasks(res.data);
    } catch {
      // silent
    }
  };

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const gridStart = startOfWeek(monthStart);
    const gridEnd = endOfWeek(monthEnd);

    const days: Date[] = [];
    let day = gridStart;
    while (day <= gridEnd) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentMonth]);

  // Map tasks to dates
  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    tasks.forEach((t) => {
      if (t.dueDate) {
        const key = format(new Date(t.dueDate), "yyyy-MM-dd");
        if (!map[key]) map[key] = [];
        map[key].push(t);
      }
    });
    return map;
  }, [tasks]);

  // Tasks for selected date
  const selectedDateTasks = useMemo(() => {
    if (!selectedDate) return [];
    const key = format(selectedDate, "yyyy-MM-dd");
    return tasksByDate[key] || [];
  }, [selectedDate, tasksByDate]);

  // Upcoming/overdue reminders
  const reminders = useMemo(() => {
    const now = new Date();
    const todayStr = format(now, "yyyy-MM-dd");
    const tomorrowStr = format(addDays(now, 1), "yyyy-MM-dd");

    return tasks
      .filter((t) => {
        if (t.status === "done" || !t.dueDate) return false;
        const dueStr = format(new Date(t.dueDate), "yyyy-MM-dd");
        return dueStr <= tomorrowStr; // overdue + today + tomorrow
      })
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .map((t) => {
        const dueStr = format(new Date(t.dueDate!), "yyyy-MM-dd");
        let tag = "Upcoming";
        let tagColor = "#0891b2";
        if (dueStr < todayStr) {
          tag = "Overdue";
          tagColor = "#ef4444";
        } else if (dueStr === todayStr) {
          tag = "Due Today";
          tagColor = "#f59e0b";
        } else {
          tag = "Tomorrow";
          tagColor = "#0891b2";
        }
        return { ...t, tag, tagColor };
      });
  }, [tasks]);

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
          <Box sx={{ mb: 4, animation: `${fadeInUp} 0.5s ease-out` }}>
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
              My Tasks
            </Typography>
            <Typography variant="body1" sx={{ color: "#64748b", fontSize: "15px" }}>
              Calendar view of your scheduled tasks
            </Typography>
          </Box>

          {/* Reminders */}
          {reminders.length > 0 && (
            <Box
              sx={{
                mb: 3,
                animation: `${fadeInUp} 0.5s ease-out`,
                animationDelay: "0.05s",
                animationFillMode: "both",
              }}
            >
              <Typography sx={{ fontWeight: 700, color: "#0f172a", fontSize: "15px", mb: 1.5 }}>
                Reminders
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {reminders.map((r) => (
                  <Box
                    key={r.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      px: 2.5,
                      py: 1.5,
                      borderRadius: "14px",
                      background: "rgba(255, 255, 255, 0.7)",
                      backdropFilter: "blur(12px)",
                      border: `1px solid ${r.tagColor}20`,
                      borderLeft: `4px solid ${r.tagColor}`,
                    }}
                  >
                    <ClockIcon sx={{ fontSize: 18, color: r.tagColor }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: "13.5px",
                          fontWeight: 600,
                          color: "#0f172a",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.title}
                      </Typography>
                      <Typography sx={{ fontSize: "11.5px", color: "#94a3b8" }}>
                        {format(new Date(r.dueDate!), "MMM d, yyyy")}
                      </Typography>
                    </Box>
                    <Chip
                      label={r.tag}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        fontSize: "10px",
                        height: "22px",
                        color: r.tagColor,
                        backgroundColor: `${r.tagColor}12`,
                        "& .MuiChip-label": { px: 1 },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1fr 340px" },
              gap: 3,
              animation: `${fadeInUp} 0.5s ease-out`,
              animationDelay: "0.1s",
              animationFillMode: "both",
            }}
          >
            {/* Calendar */}
            <Box
              sx={{
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(16px)",
                borderRadius: "18px",
                border: "1px solid rgba(255, 255, 255, 0.8)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                p: 3,
              }}
            >
              {/* Month Navigation */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <IconButton
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  sx={{ color: "#64748b" }}
                >
                  <ChevronLeft />
                </IconButton>
                <Typography sx={{ fontWeight: 700, fontSize: "18px", color: "#0f172a" }}>
                  {format(currentMonth, "MMMM yyyy")}
                </Typography>
                <IconButton
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  sx={{ color: "#64748b" }}
                >
                  <ChevronRight />
                </IconButton>
              </Box>

              {/* Weekday Headers */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: 0.5,
                  mb: 1,
                }}
              >
                {WEEKDAYS.map((day) => (
                  <Typography
                    key={day}
                    sx={{
                      textAlign: "center",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      py: 0.5,
                    }}
                  >
                    {day}
                  </Typography>
                ))}
              </Box>

              {/* Calendar Grid */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: 0.5,
                }}
              >
                {calendarDays.map((day, idx) => {
                  const dayKey = format(day, "yyyy-MM-dd");
                  const dayTasks = tasksByDate[dayKey] || [];
                  const inMonth = isSameMonth(day, currentMonth);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isDayToday = isToday(day);

                  return (
                    <Box
                      key={idx}
                      onClick={() => setSelectedDate(day)}
                      sx={{
                        minHeight: { xs: "48px", md: "64px" },
                        p: 0.75,
                        borderRadius: "10px",
                        cursor: "pointer",
                        opacity: inMonth ? 1 : 0.3,
                        background: isSelected
                          ? "linear-gradient(135deg, rgba(0, 212, 212, 0.12), rgba(8, 145, 178, 0.12))"
                          : isDayToday
                            ? "rgba(8, 145, 178, 0.04)"
                            : "transparent",
                        border: isSelected
                          ? "2px solid #0891b2"
                          : isDayToday
                            ? "1px solid rgba(8, 145, 178, 0.2)"
                            : "1px solid transparent",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          background: isSelected
                            ? "linear-gradient(135deg, rgba(0, 212, 212, 0.15), rgba(8, 145, 178, 0.15))"
                            : "rgba(0, 0, 0, 0.02)",
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: isDayToday || isSelected ? 700 : 500,
                          color: isSelected
                            ? "#0891b2"
                            : isDayToday
                              ? "#0891b2"
                              : "#0f172a",
                          mb: 0.25,
                        }}
                      >
                        {format(day, "d")}
                      </Typography>
                      {/* Task dots */}
                      {dayTasks.length > 0 && (
                        <Box sx={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
                          {dayTasks.slice(0, 3).map((t) => (
                            <Box
                              key={t.id}
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: getPriorityColor(t.priority),
                              }}
                            />
                          ))}
                          {dayTasks.length > 3 && (
                            <Typography sx={{ fontSize: "8px", color: "#94a3b8", lineHeight: "6px" }}>
                              +{dayTasks.length - 3}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* Selected Date Tasks */}
            <Box>
              <Box
                sx={{
                  background: "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(16px)",
                  borderRadius: "18px",
                  border: "1px solid rgba(255, 255, 255, 0.8)",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                  p: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
                  <CalendarToday sx={{ fontSize: 18, color: "#0891b2" }} />
                  <Typography sx={{ fontWeight: 700, color: "#0f172a", fontSize: "15px" }}>
                    {selectedDate ? format(selectedDate, "EEEE, MMM d") : "Select a date"}
                  </Typography>
                </Box>

                {selectedDateTasks.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography sx={{ color: "#94a3b8", fontSize: "13.5px" }}>
                      No tasks scheduled
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {selectedDateTasks.map((task) => {
                      const sc = getStatusConfig(task.status);
                      return (
                        <Box
                          key={task.id}
                          sx={{
                            p: 2,
                            borderRadius: "12px",
                            background: "rgba(248, 250, 252, 0.6)",
                            borderLeft: `3px solid ${getPriorityColor(task.priority)}`,
                            transition: "all 0.2s ease",
                            "&:hover": {
                              background: "rgba(248, 250, 252, 0.9)",
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: "13.5px",
                              color: "#0f172a",
                              mb: 0.5,
                            }}
                          >
                            {task.title}
                          </Typography>
                          {task.description && (
                            <Typography
                              sx={{
                                fontSize: "12px",
                                color: "#64748b",
                                mb: 1,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {task.description}
                            </Typography>
                          )}
                          <Box sx={{ display: "flex", gap: 0.5 }}>
                            <Chip
                              label={sc.label}
                              size="small"
                              sx={{
                                fontWeight: 600,
                                fontSize: "10px",
                                height: "20px",
                                color: sc.color,
                                backgroundColor: sc.bg,
                                "& .MuiChip-label": { px: 0.75 },
                              }}
                            />
                            {task.dueDate && new Date(task.dueDate).getHours() !== 0 && (
                              <Chip
                                label={format(new Date(task.dueDate), "h:mm a")}
                                size="small"
                                sx={{
                                  fontWeight: 600,
                                  fontSize: "10px",
                                  height: "20px",
                                  color: "#64748b",
                                  backgroundColor: "rgba(0,0,0,0.04)",
                                  "& .MuiChip-label": { px: 0.75 },
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MyTasksPage;
