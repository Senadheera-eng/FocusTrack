import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  Box,
  Typography,
  IconButton,
  Switch,
  Avatar,
  Button,
  TextField,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Person,
  Notifications,
  Palette,
  Info,
  CameraAlt,
  Check as CheckIcon,
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dueDateReminders, setDueDateReminders] = useState(true);
  const [overdueAlerts, setOverdueAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Profile state
  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const userEmail = getEmailFromToken();
  const displayName = username || (userEmail ? userEmail.split("@")[0] : "User");
  const initials = displayName.slice(0, 2).toUpperCase();

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:4000/auth/me");
        if (res.data.username) setUsername(res.data.username);
        if (res.data.profilePicture) setProfilePicture(res.data.profilePicture);
      } catch {
        // silent
      }
    };
    fetchProfile();
  }, []);

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size (max 2MB)
    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) {
      setSaveMessage("Image must be under 2MB");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setProfilePicture(base64);
      try {
        await axios.patch("http://localhost:4000/auth/profile", { profilePicture: base64 });
        setSaveMessage("Profile picture updated");
        setTimeout(() => setSaveMessage(""), 3000);
      } catch {
        setSaveMessage("Failed to save picture");
        setTimeout(() => setSaveMessage(""), 3000);
      }
    };
    reader.readAsDataURL(file);

    // Reset file input
    e.target.value = "";
  };

  const handleSaveUsername = async () => {
    if (!usernameInput.trim()) return;
    setSaving(true);
    try {
      const res = await axios.patch("http://localhost:4000/auth/profile", {
        username: usernameInput.trim(),
      });
      setUsername(res.data.username || usernameInput.trim());
      setEditingUsername(false);
      setSaveMessage("Username updated");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch {
      setSaveMessage("Failed to save username");
      setTimeout(() => setSaveMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleStartEditUsername = () => {
    setUsernameInput(username || (userEmail ? userEmail.split("@")[0] : ""));
    setEditingUsername(true);
  };

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

          {/* Success / Error Message */}
          {saveMessage && (
            <Box
              sx={{
                mb: 2,
                px: 2.5,
                py: 1.5,
                borderRadius: "12px",
                background: saveMessage.includes("Failed")
                  ? "rgba(239, 68, 68, 0.08)"
                  : "rgba(16, 185, 129, 0.08)",
                border: `1px solid ${saveMessage.includes("Failed") ? "rgba(239, 68, 68, 0.2)" : "rgba(16, 185, 129, 0.2)"}`,
                animation: `${fadeInUp} 0.3s ease-out`,
              }}
            >
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: saveMessage.includes("Failed") ? "#ef4444" : "#10b981",
                }}
              >
                {saveMessage}
              </Typography>
            </Box>
          )}

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

            <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, mb: 3 }}>
              {/* Avatar with upload overlay */}
              <Box
                onClick={handleProfilePictureClick}
                sx={{
                  position: "relative",
                  cursor: "pointer",
                  "&:hover .avatar-overlay": { opacity: 1 },
                }}
              >
                <Avatar
                  src={profilePicture || undefined}
                  sx={{
                    width: 64,
                    height: 64,
                    background: "linear-gradient(135deg, #00d4d4, #0891b2)",
                    fontSize: "22px",
                    fontWeight: 700,
                  }}
                >
                  {!profilePicture && initials}
                </Avatar>
                <Box
                  className="avatar-overlay"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: "50%",
                    background: "rgba(0, 0, 0, 0.45)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "opacity 0.2s ease",
                  }}
                >
                  <CameraAlt sx={{ color: "white", fontSize: 22 }} />
                </Box>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 700, color: "#0f172a", fontSize: "16px" }}>
                  {displayName}
                </Typography>
                <Typography sx={{ color: "#64748b", fontSize: "13px" }}>
                  {userEmail}
                </Typography>
                <Typography
                  sx={{
                    color: "#94a3b8",
                    fontSize: "11px",
                    mt: 0.5,
                  }}
                >
                  Click avatar to change photo
                </Typography>
              </Box>
            </Box>

            {/* Username edit */}
            <Box
              sx={{
                pt: 2,
                borderTop: "1px solid rgba(0, 0, 0, 0.06)",
              }}
            >
              <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#64748b", mb: 1 }}>
                Display Name
              </Typography>
              {editingUsername ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <TextField
                    size="small"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Enter username"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveUsername();
                      if (e.key === "Escape") setEditingUsername(false);
                    }}
                    sx={{
                      flex: 1,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "14px",
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleSaveUsername}
                    disabled={saving || !usernameInput.trim()}
                    startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <CheckIcon />}
                    sx={{
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 600,
                      background: "linear-gradient(135deg, #00d4d4, #0891b2)",
                      px: 2,
                      "&:hover": {
                        background: "linear-gradient(135deg, #0891b2, #0e7490)",
                      },
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    size="small"
                    onClick={() => setEditingUsername(false)}
                    sx={{
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 600,
                      color: "#64748b",
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: "14px", color: "#0f172a", fontWeight: 500 }}>
                    {displayName}
                  </Typography>
                  <Button
                    size="small"
                    onClick={handleStartEditUsername}
                    sx={{
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "12px",
                      color: "#0891b2",
                    }}
                  >
                    Change
                  </Button>
                </Box>
              )}
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
                  Dark Mode
                </Typography>
                <Typography sx={{ fontSize: "12px", color: "#94a3b8" }}>
                  Switch to a darker color theme
                </Typography>
              </Box>
              <Switch
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
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
