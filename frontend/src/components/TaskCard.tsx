import React from "react";
import {
  Box,
  Typography,
  Chip,
  Button,
  IconButton,
  Stack,
} from "@mui/material";
import {
  CheckCircle,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import Timer from "./Timer";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

interface TaskCardProps {
  task: Task;
  onMarkComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case "high":
      return { label: "High", color: "#ef4444", bgColor: "rgba(239, 68, 68, 0.08)" };
    case "low":
      return { label: "Low", color: "#94a3b8", bgColor: "rgba(148, 163, 184, 0.08)" };
    default:
      return { label: "Medium", color: "#f59e0b", bgColor: "rgba(245, 158, 11, 0.08)" };
  }
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case "done":
      return {
        label: "Completed",
        color: "#10b981",
        bgColor: "rgba(16, 185, 129, 0.08)",
        borderColor: "rgba(16, 185, 129, 0.3)",
      };
    case "in_progress":
      return {
        label: "In Progress",
        color: "#f59e0b",
        bgColor: "rgba(245, 158, 11, 0.08)",
        borderColor: "rgba(245, 158, 11, 0.3)",
      };
    default:
      return {
        label: "To Do",
        color: "#8b5cf6",
        bgColor: "rgba(139, 92, 246, 0.08)",
        borderColor: "rgba(139, 92, 246, 0.3)",
      };
  }
};

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onMarkComplete,
  onDelete,
  onEdit,
}) => {
  const statusConfig = getStatusConfig(task.status);
  const priorityConfig = getPriorityConfig(task.priority);

  return (
    <Box
      sx={{
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(16px)",
        borderRadius: "18px",
        border: "1px solid rgba(255, 255, 255, 0.8)",
        borderLeft: `4px solid ${statusConfig.borderColor}`,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 28px rgba(0, 0, 0, 0.08)",
          background: "rgba(255, 255, 255, 0.85)",
          borderLeftColor: statusConfig.color,
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, pb: 0 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1.5,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#0f172a",
              lineHeight: 1.3,
              flex: 1,
              fontSize: "16px",
            }}
          >
            {task.title}
          </Typography>
          <Box sx={{ display: "flex", gap: 0.5, ml: 1.5, flexShrink: 0 }}>
            <Chip
              label={priorityConfig.label}
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: "10px",
                height: "22px",
                color: priorityConfig.color,
                backgroundColor: priorityConfig.bgColor,
                "& .MuiChip-label": { px: 1 },
              }}
            />
            <Chip
              label={statusConfig.label}
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: "10px",
                height: "22px",
                color: statusConfig.color,
                backgroundColor: statusConfig.bgColor,
                border: `1px solid ${statusConfig.borderColor}`,
                "& .MuiChip-label": { px: 1 },
              }}
            />
          </Box>
        </Box>

        {task.description && (
          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              mb: 2,
              fontSize: "13.5px",
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {task.description}
          </Typography>
        )}
      </Box>

      {/* Timer */}
      <Box sx={{ px: 3, py: 1.5, flex: 1 }}>
        <Timer taskId={task.id} />
      </Box>

      {/* Footer */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid rgba(0, 0, 0, 0.04)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: "auto",
        }}
      >
        <Stack spacing={0.5}>
          <Typography
            variant="caption"
            sx={{ color: "#94a3b8", fontSize: "11.5px" }}
          >
            {format(new Date(task.createdAt), "MMM d, yyyy")}
          </Typography>
          {task.completedAt && (
            <Typography
              variant="caption"
              sx={{ color: "#10b981", fontSize: "11.5px", fontWeight: 600 }}
            >
              Done {format(new Date(task.completedAt), "MMM d")}
            </Typography>
          )}
        </Stack>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {task.status !== "done" && (
            <Button
              size="small"
              variant="contained"
              startIcon={<CheckCircle sx={{ fontSize: "16px !important" }} />}
              onClick={() => onMarkComplete(task.id)}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "12px",
                px: 1.5,
                py: 0.5,
                background: "linear-gradient(135deg, #10b981, #059669)",
                boxShadow: "0 2px 8px rgba(16, 185, 129, 0.25)",
                minWidth: "auto",
                "&:hover": {
                  background: "linear-gradient(135deg, #059669, #047857)",
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.35)",
                },
              }}
            >
              Done
            </Button>
          )}
          <IconButton
            size="small"
            onClick={() => onEdit(task)}
            sx={{
              color: "#94a3b8",
              width: 32,
              height: 32,
              "&:hover": {
                color: "#0891b2",
                bgcolor: "rgba(8, 145, 178, 0.08)",
              },
            }}
          >
            <EditIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete(task.id)}
            sx={{
              color: "#94a3b8",
              width: 32,
              height: 32,
              "&:hover": {
                color: "#ef4444",
                bgcolor: "rgba(239, 68, 68, 0.08)",
              },
            }}
          >
            <DeleteIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default TaskCard;
