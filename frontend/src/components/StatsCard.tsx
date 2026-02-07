import React from "react";
import { Card, CardContent, Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { SvgIconComponent } from "@mui/icons-material";

interface StatsCardProps {
  icon: SvgIconComponent;
  value: number;
  label: string;
  iconBgColor: string;
  iconColor: string;
}

const StyledStatsCard = styled(Card)(({ theme }) => ({
  background:
    "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 1) 100%)",
  backdropFilter: "blur(20px)",
  borderRadius: "16px",
  border: "1px solid rgba(0, 212, 212, 0.1)",
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(0, 212, 212, 0.2)",
  },
}));

const StatsCard: React.FC<StatsCardProps> = ({
  icon: Icon,
  value,
  label,
  iconBgColor,
  iconColor,
}) => {
  return (
    <StyledStatsCard>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: "12px",
              bgcolor: iconBgColor,
              mr: 2,
            }}
          >
            <Icon sx={{ color: iconColor, fontSize: 28 }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#2d3748" }}>
            {value}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {label}
        </Typography>
      </CardContent>
    </StyledStatsCard>
  );
};

export default StatsCard;
