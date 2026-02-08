import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Typography,
  IconButton,
  Switch,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Person,
  Notifications,
  Palette,
  Info,
} from "@mui/icons-material";
import { keyframes } from "@mui/material/styles";

import Sidebar, { SIDEBAR_WIDTH } from "../components/Sidebar";

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

const cardSx = {
  background: "rgba(255, 255, 255, 0.7)",
  backdropFilter: "blur(16px)",
  borderRadius: "18px",
  border: "1px solid rgba(255, 255, 255, 0.8)",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
  p: 3,
  mb: 3,
};

const SettingsPage: React.FC = () => {
  const { logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dueDateReminders, setDueDateReminders] = useState(true);
  const [overdueAlerts, setOverdueAlerts] = useState(true);
  const [compactView, setCompactView] = useState(false);

  const userEmail = getEmailFromToken();
  const userName = userEmail ? userEmail.split("@")[0] : "User";
  const initials = userName.slice(0, 2).toUpperCase();

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

        <Box sx={{ p: { xs: 2.5, sm: 3, md: 4, lg: 5 }, maxWidth: "800px" }}>
          {/* Title */}
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
              Settings
            </Typography>
            <Typography variant="body1" sx={{ color: "#64748b", fontSize: "15px" }}>
              Manage your account and preferences
            </Typography>
          </Box>

          {/* Profile Card */}
          <Box
            sx={{
              ...cardSx,
              animation: `${fadeInUp} 0.5s ease-out`,
              animationDelay: "0.1s",
              animationFillMode: "both",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
              <Person sx={{ fontSize: 20, color: "#0891b2" }} />
              <Typography sx={{ fontWeight: 700, color: "#0f172a", fontSize: "15px" }}>
                Profile
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  background: "linear-gradient(135deg, #00d4d4, #0891b2)",
                  fontSize: "20px",
                  fontWeight: 700,
                }}
              >
                {initials}
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 700, color: "#0f172a", fontSize: "16px" }}>
                  {userName}
                </Typography>
                <Typography sx={{ color: "#64748b", fontSize: "13px" }}>
                  {userEmail}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Notifications Card */}
          <Box
            sx={{
              ...cardSx,
              animation: `${fadeInUp} 0.5s ease-out`,
              animationDelay: "0.15s",
              animationFillMode: "both",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
              <Notifications sx={{ fontSize: 20, color: "#f59e0b" }} />
              <Typography sx={{ fontWeight: 700, color: "#0f172a", fontSize: "15px" }}>
                Notifications
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1.5,
                  borderBottom: "1px solid rgba(0, 0, 0, 0.04)",
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>
                    Due Date Reminders
                  </Typography>
                  <Typography sx={{ fontSize: "12px", color: "#94a3b8" }}>
                    Show reminders for tasks due today
                  </Typography>
                </Box>
                <Switch
                  checked={dueDateReminders}
                  onChange={(e) => setDueDateReminders(e.target.checked)}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": { color: "#0891b2" },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#0891b2",
                    },
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1.5,
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>
                    Overdue Alerts
                  </Typography>
                  <Typography sx={{ fontSize: "12px", color: "#94a3b8" }}>
                    Highlight overdue tasks in red
                  </Typography>
                </Box>
                <Switch
                  checked={overdueAlerts}
                  onChange={(e) => setOverdueAlerts(e.target.checked)}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": { color: "#0891b2" },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#0891b2",
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Appearance Card */}
          <Box
            sx={{
              ...cardSx,
              animation: `${fadeInUp} 0.5s ease-out`,
              animationDelay: "0.2s",
              animationFillMode: "both",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
              <Palette sx={{ fontSize: 20, color: "#8b5cf6" }} />
              <Typography sx={{ fontWeight: 700, color: "#0f172a", fontSize: "15px" }}>
                Appearance
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1.5,
              }}
            >
              <Box>
                <Typography sx={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>
                  Compact View
                </Typography>
                <Typography sx={{ fontSize: "12px", color: "#94a3b8" }}>
                  Reduce spacing in task cards
                </Typography>
              </Box>
              <Switch
                checked={compactView}
                onChange={(e) => setCompactView(e.target.checked)}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": { color: "#0891b2" },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#0891b2",
                  },
                }}
              />
            </Box>
          </Box>

          {/* About Card */}
          <Box
            sx={{
              ...cardSx,
              animation: `${fadeInUp} 0.5s ease-out`,
              animationDelay: "0.25s",
              animationFillMode: "both",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
              <Info sx={{ fontSize: 20, color: "#64748b" }} />
              <Typography sx={{ fontWeight: 700, color: "#0f172a", fontSize: "15px" }}>
                About
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: "13px", color: "#64748b" }}>App Name</Typography>
                <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>FocusTrack</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: "13px", color: "#64748b" }}>Version</Typography>
                <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>1.0.0</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: "13px", color: "#64748b" }}>Stack</Typography>
                <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>React + NestJS</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SettingsPage;
