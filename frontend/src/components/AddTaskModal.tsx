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
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import axios from "axios";

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onTaskAdded: () => void;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "16px",
    maxWidth: "500px",
    width: "100%",
  },
}));

const StyledButton = styled(Button)({
  borderRadius: "10px",
  padding: "10px 24px",
  textTransform: "none",
  fontWeight: 600,
  transition: "all 0.3s ease",
});

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  open,
  onClose,
  onTaskAdded,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"todo" | "in_progress" | "done">("todo");
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

    // Validate
    if (!validateTitle(title)) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:4000/tasks", {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
      });

      // Success - reset form and close
      setTitle("");
      setDescription("");
      setStatus("todo");
      onTaskAdded(); // Refresh tasks list
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
      setStatus("todo");
      setError("");
      setTitleError("");
      onClose();
    }
  };

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            fontWeight: 700,
            fontSize: "24px",
            background: "linear-gradient(135deg, #00d4d4 0%, #00a8a8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Create New Task
        </Box>
        <IconButton onClick={handleClose} disabled={loading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: "8px" }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Title Field */}
            <TextField
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  "&.Mui-focused fieldset": {
                    borderColor: "#00d4d4",
                    borderWidth: "2px",
                  },
                },
              }}
            />

            {/* Description Field */}
            <TextField
              label="Description (Optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
              fullWidth
              disabled={loading}
              helperText={`${description.length}/1000 characters`}
              inputProps={{ maxLength: 1000 }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  "&.Mui-focused fieldset": {
                    borderColor: "#00d4d4",
                    borderWidth: "2px",
                  },
                },
              }}
            />

            {/* Status Field */}
            <TextField
              select
              label="Status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "todo" | "in_progress" | "done")
              }
              fullWidth
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  "&.Mui-focused fieldset": {
                    borderColor: "#00d4d4",
                    borderWidth: "2px",
                  },
                },
              }}
            >
              <MenuItem value="todo">To Do</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </TextField>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <StyledButton
            onClick={handleClose}
            disabled={loading}
            sx={{
              color: "#666",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            Cancel
          </StyledButton>
          <StyledButton
            type="submit"
            variant="contained"
            disabled={loading || !title.trim()}
            sx={{
              background: "linear-gradient(135deg, #00d4d4 0%, #00a8a8 100%)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(135deg, #00a8a8 0%, #008888 100%)",
              },
              "&:disabled": {
                background: "#ccc",
              },
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Creating...
              </>
            ) : (
              "Create Task"
            )}
          </StyledButton>
        </DialogActions>
      </form>
    </StyledDialog>
  );
};

export default AddTaskModal;
