import React from "react";
import { Box, Typography } from "@mui/material";
import type { SvgIconComponent } from "@mui/icons-material";

interface StatsCardProps {
  icon: SvgIconComponent;
  value: number | string;
  label: string;
  color: string;
  bgColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  icon: Icon,
  value,
  label,
  color,
  bgColor,
}) => {
  return (
    <Box
      sx={{
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(16px)",
        borderRadius: "18px",
        border: "1px solid rgba(255, 255, 255, 0.8)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
        p: { xs: 2.5, md: 3 },
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "default",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 28px rgba(0, 0, 0, 0.08)",
          background: "rgba(255, 255, 255, 0.85)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "14px",
            background: bgColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon sx={{ color, fontSize: 24 }} />
        </Box>
      </Box>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          color: "#0f172a",
          fontSize: { xs: "1.8rem", md: "2.2rem" },
          letterSpacing: "-0.5px",
          lineHeight: 1,
          mb: 0.5,
        }}
      >
        {value}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "#64748b",
          fontWeight: 500,
          fontSize: "13px",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default StatsCard;
