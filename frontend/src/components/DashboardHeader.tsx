import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

interface DashboardHeaderProps {
  onLogout: () => void;
}

const StyledAppBar = styled(AppBar)({
  background: "linear-gradient(135deg, #00d4d4 0%, #00a8a8 100%)",
  boxShadow: "0 4px 20px rgba(0, 212, 212, 0.3)",
});

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onLogout }) => {
  return (
    <StyledAppBar position="static" elevation={0}>
      <Toolbar>
        <Typography
          variant="h5"
          sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: "0.5px" }}
        >
          FocusTrack
        </Typography>
        <Button
          color="inherit"
          startIcon={<LogoutIcon />}
          onClick={onLogout}
          sx={{
            borderRadius: "12px",
            px: 3,
            textTransform: "none",
            fontWeight: 600,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              transform: "translateY(-2px)",
            },
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </StyledAppBar>
  );
};

export default DashboardHeader;
