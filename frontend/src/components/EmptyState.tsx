import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Add as AddIcon, Assignment } from "@mui/icons-material";
import { keyframes } from "@mui/material/styles";

interface EmptyStateProps {
  onAddTask: () => void;
}

const floatGentle = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const EmptyState: React.FC<EmptyStateProps> = ({ onAddTask }) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: { xs: 6, md: 10 },
        px: 3,
        borderRadius: "24px",
        border: "2px dashed rgba(8, 145, 178, 0.15)",
        background:
          "linear-gradient(135deg, rgba(8, 145, 178, 0.02) 0%, rgba(0, 212, 212, 0.04) 100%)",
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: "22px",
          background: "rgba(8, 145, 178, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 3,
          animation: `${floatGentle} 3s ease-in-out infinite`,
        }}
      >
        <Assignment sx={{ fontSize: 36, color: "#0891b2", opacity: 0.6 }} />
      </Box>

      <Typography
        variant="h6"
        sx={{ mb: 1, fontWeight: 700, color: "#0f172a", fontSize: "18px" }}
      >
        No tasks yet
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "#64748b", mb: 4, fontSize: "14px", maxWidth: 320, mx: "auto" }}
      >
        Create your first task to get started on your productivity journey
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAddTask}
        sx={{
          background: "linear-gradient(135deg, #00d4d4 0%, #0891b2 100%)",
          borderRadius: "14px",
          padding: "12px 28px",
          textTransform: "none",
          fontWeight: 700,
          fontSize: "14px",
          boxShadow: "0 4px 14px rgba(0, 212, 212, 0.3)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            background: "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)",
            transform: "translateY(-2px)",
            boxShadow: "0 6px 20px rgba(0, 212, 212, 0.4)",
          },
        }}
      >
        Create Task
      </Button>
    </Box>
  );
};

export default EmptyState;
