import React from "react";
import { Card, CardContent, Typography, Button, Fade } from "@mui/material";
import { Add as AddIcon, Assignment } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

interface EmptyStateProps {
  onAddTask: () => void;
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

const EmptyState: React.FC<EmptyStateProps> = ({ onAddTask }) => {
  return (
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
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first task to get started on your productivity journey
          </Typography>
          <AddTaskButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddTask}
          >
            Create Task
          </AddTaskButton>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default EmptyState;
