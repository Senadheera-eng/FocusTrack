import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  Collapse,
  CircularProgress,
  Fade,
  Divider,
  Stack,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Login as LoginIcon,
  PersonAdd,
  CheckCircle,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

interface AuthFormProps {
  isLogin: boolean;
}

// Styled components for glassmorphism effect
const GlassContainer = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.85)",
  backdropFilter: "blur(20px)",
  borderRadius: "24px",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
}));

const GradientBox = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  padding: theme.spacing(6),
  textAlign: "center",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: "14px 32px",
  borderRadius: "12px",
  fontSize: "16px",
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "0 4px 14px rgba(102, 126, 234, 0.4)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
  },
}));

const AuthForm: React.FC<AuthFormProps> = ({ isLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const { state, login, register } = useAuth();
  const navigate = useNavigate();

  // Reset errors when switching between login/register
  useEffect(() => {
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }, [isLogin]);

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  // Validate password
  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  // Validate confirm password
  const validateConfirmPassword = (confirmPass: string): boolean => {
    if (!isLogin) {
      if (!confirmPass) {
        setConfirmPasswordError("Please confirm your password");
        return false;
      }
      if (confirmPass !== password) {
        setConfirmPasswordError("Passwords do not match");
        return false;
      }
      setConfirmPasswordError("");
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (
      !isEmailValid ||
      !isPasswordValid ||
      (!isLogin && !isConfirmPasswordValid)
    ) {
      return;
    }

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }

      // Navigate on success
      if (!state.error) {
        navigate("/dashboard");
      }
    } catch (error) {
      // Error is handled by AuthContext
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "relative",
        padding: 2,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Fade in timeout={800}>
          <GlassContainer elevation={0}>
            {/* Header Section */}
            <GradientBox>
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Typography
                  variant="h3"
                  sx={{
                    color: "white",
                    fontWeight: 700,
                    mb: 2,
                    letterSpacing: "-0.5px",
                  }}
                >
                  {isLogin ? "Welcome Back" : "Create Account"}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: "16px",
                  }}
                >
                  {isLogin
                    ? "Sign in to access your productivity dashboard"
                    : "Join FocusTrack and start managing your time"}
                </Typography>
              </Box>
            </GradientBox>

            {/* Form Section */}
            <Box sx={{ p: 5 }}>
              {/* Error Alert */}
              <Collapse in={!!state.error}>
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: "12px",
                    "& .MuiAlert-icon": {
                      fontSize: "24px",
                    },
                  }}
                >
                  {state.error}
                </Alert>
              </Collapse>

              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  {/* Email Field */}
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) validateEmail(e.target.value);
                    }}
                    onBlur={() => validateEmail(email)}
                    error={!!emailError}
                    helperText={emailError}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: "action.active" }} />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: "12px",
                        backgroundColor: "rgba(102, 126, 234, 0.04)",
                        "& fieldset": {
                          borderColor: "rgba(102, 126, 234, 0.2)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(102, 126, 234, 0.4) !important",
                        },
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "#667eea",
                          borderWidth: "2px",
                        },
                      },
                    }}
                  />

                  {/* Password Field */}
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) validatePassword(e.target.value);
                    }}
                    onBlur={() => validatePassword(password)}
                    error={!!passwordError}
                    helperText={
                      passwordError || (!isLogin && "Minimum 6 characters")
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: "action.active" }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: "action.active" }} />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: "12px",
                        backgroundColor: "rgba(102, 126, 234, 0.04)",
                        "& fieldset": {
                          borderColor: "rgba(102, 126, 234, 0.2)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(102, 126, 234, 0.4) !important",
                        },
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "#667eea",
                          borderWidth: "2px",
                        },
                      },
                    }}
                  />

                  {/* Confirm Password Field (Register Only) */}
                  {!isLogin && (
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (confirmPasswordError)
                          validateConfirmPassword(e.target.value);
                      }}
                      onBlur={() => validateConfirmPassword(confirmPassword)}
                      error={!!confirmPasswordError}
                      helperText={confirmPasswordError}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CheckCircle sx={{ color: "action.active" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              edge="end"
                              sx={{ color: "action.active" }}
                            >
                              {showConfirmPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: "12px",
                          backgroundColor: "rgba(102, 126, 234, 0.04)",
                          "& fieldset": {
                            borderColor: "rgba(102, 126, 234, 0.2)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(102, 126, 234, 0.4) !important",
                          },
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&.Mui-focused fieldset": {
                            borderColor: "#667eea",
                            borderWidth: "2px",
                          },
                        },
                      }}
                    />
                  )}

                  {/* Submit Button */}
                  <StyledButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={state.loading}
                    startIcon={
                      state.loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : isLogin ? (
                        <LoginIcon />
                      ) : (
                        <PersonAdd />
                      )
                    }
                    sx={{
                      mt: 2,
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      "&:disabled": {
                        background: "rgba(102, 126, 234, 0.5)",
                      },
                    }}
                  >
                    {state.loading
                      ? isLogin
                        ? "Signing In..."
                        : "Creating Account..."
                      : isLogin
                        ? "Sign In"
                        : "Create Account"}
                  </StyledButton>
                </Stack>
              </form>

              {/* Divider */}
              <Divider sx={{ my: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              {/* Toggle Link */}
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <Link
                    to={isLogin ? "/register" : "/login"}
                    style={{
                      marginLeft: "8px",
                      color: "#667eea",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    {isLogin ? "Sign Up" : "Sign In"}
                  </Link>
                </Typography>
              </Box>
            </Box>

            {/* Footer */}
            <Box
              sx={{
                textAlign: "center",
                pb: 3,
                px: 3,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                © {new Date().getFullYear()} FocusTrack • Built for ANKA
                Technologies
              </Typography>
            </Box>
          </GlassContainer>
        </Fade>
      </Container>
    </Box>
  );
};

export default AuthForm;
