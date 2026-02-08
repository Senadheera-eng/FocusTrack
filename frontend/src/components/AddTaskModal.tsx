import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  MenuItem,
  CircularProgress,
  Alert,
  Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import axios from "axios";

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onTaskAdded: () => void;
}

const StyledDialog = styled(Dialog)({
  "& .MuiDialog-paper": {
    borderRadius: "20px",
    maxWidth: "500px",
    width: "100%",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.8)",
    boxShadow: "0 24px 48px rgba(0, 0, 0, 0.12)",
  },
  "& .MuiBackdrop-root": {
    backdropFilter: "blur(8px)",
    background: "rgba(15, 23, 42, 0.3)",
  },
});

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    backgroundColor: "rgba(248, 250, 252, 0.6)",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(248, 250, 252, 0.9)",
    },
    "&.Mui-focused": {
      backgroundColor: "rgba(255, 255, 255, 1)",
      boxShadow: "0 2px 12px rgba(8, 145, 178, 0.08)",
      "& fieldset": {
        borderColor: "#0891b2",
        borderWidth: "2px",
      },
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#0891b2",
  },
});

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  open,
  onClose,
  onTaskAdded,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [titleError, setTitleError] = useState("");

  const validateTitle = (value: string): boolean => {
    if (!value.trim()) {
      setTitleError("Title is required");
      return false;
    }
    if (value.length > 200) {
      setTitleError("Title must be less than 200 characters");
      return false;
    }
    setTitleError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateTitle(title)) {
      return;
    }

    if (!dueDate) {
      setError("Due date is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Build the due date ISO string
      const dueDateISO = dueTime
        ? new Date(`${dueDate}T${dueTime}`).toISOString()
        : new Date(`${dueDate}T00:00:00`).toISOString();

      await axios.post("http://localhost:4000/tasks", {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDateISO,
      });

      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      setDueTime("");
      onTaskAdded();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      setDueTime("");
      setError("");
      setTitleError("");
      onClose();
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split("T")[0];

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Box
          sx={{
            fontWeight: 800,
            fontSize: "22px",
            background: "linear-gradient(135deg, #00d4d4 0%, #0891b2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.3px",
          }}
        >
          Create New Task
        </Box>
        <IconButton
          onClick={handleClose}
          disabled={loading}
          sx={{
            color: "#94a3b8",
            "&:hover": { color: "#64748b", bgcolor: "rgba(0,0,0,0.04)" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2.5,
                borderRadius: "12px",
                background: "rgba(239, 68, 68, 0.06)",
                border: "1px solid rgba(239, 68, 68, 0.12)",
              }}
            >
              {error}
            </Alert>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <StyledTextField
              label="Task Title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) validateTitle(e.target.value);
              }}
              onBlur={() => validateTitle(title)}
              error={!!titleError}
              helperText={titleError || `${title.length}/200 characters`}
              required
              fullWidth
              autoFocus
              disabled={loading}
            />

            <StyledTextField
              label="Description (Optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
              disabled={loading}
              helperText={`${description.length}/1000 characters`}
              inputProps={{ maxLength: 1000 }}
            />

            <StyledTextField
              select
              label="Priority"
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as "low" | "medium" | "high")
              }
              fullWidth
              disabled={loading}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </StyledTextField>

            {/* Due Date & Time */}
            <Box>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#475569",
                  mb: 1,
                }}
              >
                Due Date *
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <StyledTextField
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  fullWidth
                  disabled={loading}
                  required
                  slotProps={{ htmlInput: { min: today } }}
                />
                <StyledTextField
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  sx={{ minWidth: "160px" }}
                  disabled={loading}
                  label="Time (Optional)"
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1, gap: 1.5 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{
              borderRadius: "12px",
              padding: "10px 24px",
              textTransform: "none",
              fontWeight: 600,
              color: "#64748b",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !title.trim() || !dueDate}
            sx={{
              borderRadius: "12px",
              padding: "10px 28px",
              textTransform: "none",
              fontWeight: 700,
              background: "linear-gradient(135deg, #00d4d4 0%, #0891b2 100%)",
              boxShadow: "0 4px 14px rgba(0, 212, 212, 0.25)",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)",
                transform: "translateY(-1px)",
                boxShadow: "0 6px 20px rgba(0, 212, 212, 0.35)",
              },
              "&:disabled": {
                background: "#e2e8f0",
                boxShadow: "none",
              },
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: "inherit" }} />
                Creating...
              </>
            ) : (
              "Create Task"
            )}
          </Button>
        </DialogActions>
      </form>
    </StyledDialog>
  );
};

export default AddTaskModal;
