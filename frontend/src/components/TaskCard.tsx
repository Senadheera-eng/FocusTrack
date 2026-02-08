import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Typography,
  Chip,
  Button,
  IconButton,
  Divider,
  Stack,
  Fade,
} from "@mui/material";
import {
  CheckCircle,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { styled } from "@mui/material/styles";
import Timer from "./Timer";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
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

const StyledTaskCard = styled(Card)(({ theme }) => ({
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

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onMarkComplete,
  onDelete,
  onEdit,
}) => {
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

  return (
    <Fade in>
      <StyledTaskCard>
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
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {task.description}
            </Typography>
          )}

          {/* Timer Component */}
          <Box sx={{ mb: 2 }}>
            <Timer taskId={task.id} />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={1}>
            <Typography variant="caption" color="text.secondary">
              Created: {format(new Date(task.createdAt), "MMM d, yyyy")}
            </Typography>
            {task.completedAt && (
              <Typography variant="caption" sx={{ color: "#4caf50" }}>
                Completed: {format(new Date(task.completedAt), "MMM d, yyyy")}
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
              onClick={() => onMarkComplete(task.id)}
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
            color="primary"
            onClick={() => onEdit(task)}
            sx={{
              "&:hover": {
                bgcolor: "rgba(0, 212, 212, 0.1)",
              },
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => onDelete(task.id)}
            sx={{
              "&:hover": {
                bgcolor: "rgba(244, 67, 54, 0.1)",
              },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </StyledTaskCard>
    </Fade>
  );
};

export default TaskCard;
