import React from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  SpaceDashboard,
  Assignment,
  Analytics,
  Settings,
  Logout,
  Close,
} from "@mui/icons-material";
import { keyframes } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import focusTrackImage from "../assets/focustrack.jpg";

// ======================== ANIMATIONS ========================

const gradientShift = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`;

const floatSlow = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(6px, -12px) rotate(3deg); }
  50% { transform: translate(-4px, -20px) rotate(-2deg); }
  75% { transform: translate(-8px, -8px) rotate(1deg); }
`;

const floatFast = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(5px, -12px) scale(1.03); }
`;

const morphBlob = keyframes`
  0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  50% { border-radius: 50% 60% 30% 60% / 30% 60% 70% 40%; }
  75% { border-radius: 60% 30% 60% 40% / 70% 40% 50% 60%; }
`;

const rotateGentle = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// ======================== TYPES ========================

interface SidebarProps {
  userEmail: string;
  onLogout: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const SIDEBAR_WIDTH = 280;

const navItems = [
  { icon: SpaceDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Assignment, label: "My Tasks", path: "/my-tasks" },
  { icon: Analytics, label: "Analytics", path: "/analytics" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

// ======================== COMPONENT ========================

const Sidebar: React.FC<SidebarProps> = ({
  userEmail,
  onLogout,
  mobileOpen,
  onMobileClose,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();

  const initials = userEmail
    ? userEmail
        .split("@")[0]
        .slice(0, 2)
        .toUpperCase()
    : "FT";

  const handleNavClick = (item: (typeof navItems)[number]) => {
    navigate(item.path);
    if (isMobile) onMobileClose();
  };

  const sidebarContent = (
    <Box
      sx={{
        position: "relative",
        zIndex: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: 3,
        pt: 4,
      }}
    >
      {/* Close button (mobile only) */}
      {isMobile && (
        <IconButton
          onClick={onMobileClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: "rgba(255,255,255,0.7)",
            "&:hover": { color: "white", background: "rgba(255,255,255,0.1)" },
          }}
        >
          <Close />
        </IconButton>
      )}

      {/* Logo */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 5 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "14px",
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: `${floatFast} 4s ease-in-out infinite`,
          }}
        >
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: "18px",
              color: "white",
              letterSpacing: "-0.5px",
            }}
          >
            FT
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{
              color: "white",
              fontWeight: 800,
              fontSize: "18px",
              letterSpacing: "-0.3px",
              lineHeight: 1.2,
            }}
          >
            FocusTrack
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "11px",
              letterSpacing: "0.5px",
            }}
          >
            Productivity Hub
          </Typography>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, flex: 1 }}>
        <Typography
          sx={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            mb: 1,
            px: 1.5,
          }}
        >
          Menu
        </Typography>

        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Box
              key={item.label}
              onClick={() => handleNavClick(item)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 2,
                py: 1.5,
                borderRadius: "14px",
                cursor: "pointer",
                background: isActive
                  ? "rgba(255, 255, 255, 0.15)"
                  : "transparent",
                backdropFilter: isActive ? "blur(8px)" : "none",
                border: isActive
                  ? "1px solid rgba(255, 255, 255, 0.15)"
                  : "1px solid transparent",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                ...(!isActive && {
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                    },
                  }),
              }}
            >
              <item.icon
                sx={{
                  color: isActive ? "white" : "rgba(255,255,255,0.6)",
                  fontSize: 20,
                }}
              />
              <Typography
                sx={{
                  color: isActive ? "white" : "rgba(255,255,255,0.7)",
                  fontSize: "14px",
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                {item.label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* User section */}
      <Box
        sx={{
          mt: 2,
          pt: 3,
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 2,
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.2)",
              fontSize: "14px",
              fontWeight: 700,
              color: "white",
            }}
          >
            {initials}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                color: "white",
                fontSize: "13px",
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {userEmail.split("@")[0]}
            </Typography>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "11px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {userEmail}
            </Typography>
          </Box>
        </Box>

        <Box
          onClick={onLogout}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2,
            py: 1.5,
            borderRadius: "14px",
            cursor: "pointer",
            transition: "all 0.25s ease",
            "&:hover": {
              background: "rgba(255, 100, 100, 0.15)",
              "& .logout-icon, & .logout-text": {
                color: "#fca5a5",
              },
            },
          }}
        >
          <Logout
            className="logout-icon"
            sx={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 20,
              transition: "color 0.25s ease",
            }}
          />
          <Typography
            className="logout-text"
            sx={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "14px",
              fontWeight: 500,
              transition: "color 0.25s ease",
            }}
          >
            Sign Out
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && mobileOpen && (
        <Box
          onClick={onMobileClose}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 1199,
            transition: "opacity 0.3s ease",
          }}
        />
      )}

      {/* Sidebar */}
      <Box
        sx={{
          width: SIDEBAR_WIDTH,
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 1200,
          overflow: "hidden",

          // Mobile: slide in/out
          ...(isMobile && {
            transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          }),

          /* Blurred focustrack.jpg base */
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-30px",
            left: "-30px",
            right: "-30px",
            bottom: "-30px",
            backgroundImage: `url(${focusTrackImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(18px) saturate(1.2)",
            zIndex: 0,
          },

          /* Animated gradient overlay */
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(-45deg, #00d4d4, #0891b2, #0e7490, #14b8a6, #06b6d4)",
            backgroundSize: "400% 400%",
            animation: `${gradientShift} 12s ease infinite`,
            opacity: 0.88,
            zIndex: 1,
          },
        }}
      >
        {/* Floating shapes */}
        <Box
          sx={{
            position: "absolute",
            top: "12%",
            right: "10%",
            width: "50px",
            height: "50px",
            background: "rgba(255,255,255,0.05)",
            animation: `${morphBlob} 10s ease-in-out infinite, ${floatSlow} 14s ease-in-out infinite`,
            zIndex: 2,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "25%",
            left: "12%",
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            border: "1.5px solid rgba(255,255,255,0.08)",
            animation: `${rotateGentle} 18s linear infinite, ${floatSlow} 10s ease-in-out infinite`,
            zIndex: 2,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "55%",
            right: "20%",
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            animation: `${floatFast} 6s ease-in-out infinite`,
            animationDelay: "2s",
            zIndex: 2,
          }}
        />

        {sidebarContent}
      </Box>
    </>
  );
};

export { SIDEBAR_WIDTH };
export default Sidebar;
