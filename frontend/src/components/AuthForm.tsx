import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Alert,
  Collapse,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  Google,
  GitHub,
  Apple,
} from "@mui/icons-material";
import { styled, keyframes } from "@mui/material/styles";

import focusTrackImage from "../assets/focustrack.jpg";

interface AuthFormProps {
  isLogin: boolean;
}

// --------------- Keyframe Animations ---------------
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(0, 212, 212, 0.4);
  }
  50% {
    box-shadow: 0 0 0 12px rgba(0, 212, 212, 0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
`;

// --------------- Styled Components ---------------
const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      boxShadow: "0 4px 20px rgba(0, 212, 212, 0.08)",
    },
    "&.Mui-focused": {
      backgroundColor: "#fff",
      boxShadow: "0 4px 20px rgba(0, 212, 212, 0.15)",
      "& fieldset": {
        borderColor: "#00d4d4",
        borderWidth: "2px",
      },
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#00b8b8",
  },
});

const SubmitButton = styled(Button)({
  borderRadius: "12px",
  padding: "14px 32px",
  fontSize: "15px",
  fontWeight: 700,
  textTransform: "none",
  letterSpacing: "0.5px",
  background: "linear-gradient(135deg, #00d4d4 0%, #00a8a8 50%, #008888 100%)",
  backgroundSize: "200% 200%",
  boxShadow: "0 4px 20px rgba(0, 212, 212, 0.35)",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    backgroundPosition: "100% 100%",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 30px rgba(0, 212, 212, 0.45)",
  },
  "&:active": {
    transform: "translateY(0px)",
  },
  "&:disabled": {
    background: "linear-gradient(135deg, #b0b0b0, #999)",
    boxShadow: "none",
  },
});

const SocialButton = styled(IconButton)({
  width: "48px",
  height: "48px",
  border: "1.5px solid rgba(0, 0, 0, 0.08)",
  borderRadius: "14px",
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  backdropFilter: "blur(8px)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    backgroundColor: "#fff",
    borderColor: "#00d4d4",
    transform: "translateY(-3px)",
    boxShadow: "0 6px 20px rgba(0, 212, 212, 0.15)",
  },
});

const OverlayToggleButton = styled(Button)({
  color: "white",
  borderColor: "rgba(255, 255, 255, 0.7)",
  borderWidth: "2px",
  borderRadius: "50px",
  padding: "12px 48px",
  fontSize: "14px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "2px",
  backdropFilter: "blur(4px)",
  backgroundColor: "rgba(255, 255, 255, 0.08)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    borderColor: "white",
    borderWidth: "2px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    transform: "translateY(-2px) scale(1.02)",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
  },
});

// --------------- Component ---------------
const AuthForm: React.FC<AuthFormProps> = ({ isLogin: initialIsLogin }) => {
  const [isSignUp, setIsSignUp] = useState(!initialIsLogin);

  // Form state (shared between both forms)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const { state, login, register } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // --------------- Validation ---------------
  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError("Email is required");
      return false;
    }
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (value: string): boolean => {
    if (!value) {
      setPasswordError("Password is required");
      return false;
    }
    if (value.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateConfirmPassword = (value: string): boolean => {
    if (!value) {
      setConfirmPasswordError("Please confirm your password");
      return false;
    }
    if (value !== password) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  // --------------- Handlers ---------------
  const handleToggle = () => {
    setIsSignUp((prev) => {
      const next = !prev;
      window.history.replaceState(null, "", next ? "/register" : "/login");
      return next;
    });
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmValid = isSignUp
      ? validateConfirmPassword(confirmPassword)
      : true;

    if (!isEmailValid || !isPasswordValid || (isSignUp && !isConfirmValid))
      return;

    try {
      if (isSignUp) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      if (!state.error) navigate("/dashboard");
    } catch {
      // Error handled by AuthContext
    }
  };

  // --------------- Form Renderer ---------------
  const renderForm = (forSignUp: boolean) => (
    <Box
      sx={{
        width: "100%",
        maxWidth: "400px",
        animation: `${fadeInUp} 0.6s ease-out`,
      }}
    >
      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          color: "#1a202c",
          mb: 0.5,
          letterSpacing: "-0.5px",
          fontSize: { xs: "1.75rem", md: "2rem" },
        }}
      >
        {forSignUp ? "Create Account" : "Welcome Back"}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "#718096",
          mb: 3,
          fontSize: "14px",
        }}
      >
        {forSignUp
          ? "Start your productivity journey today"
          : "Sign in to continue your focus session"}
      </Typography>

      {/* Social Login */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <SocialButton>
          <Google sx={{ fontSize: 20, color: "#DB4437" }} />
        </SocialButton>
        <SocialButton>
          <GitHub sx={{ fontSize: 20, color: "#333" }} />
        </SocialButton>
        <SocialButton>
          <Apple sx={{ fontSize: 20, color: "#000" }} />
        </SocialButton>
      </Box>

      {/* Divider */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
          gap: 2,
        }}
      >
        <Box sx={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, #cbd5e0)" }} />
        <Typography
          variant="caption"
          sx={{ color: "#a0aec0", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase" }}
        >
          or use email
        </Typography>
        <Box sx={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, #cbd5e0)" }} />
      </Box>

      {/* Error Alert */}
      <Collapse in={!!state.error}>
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: "12px",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(211, 47, 47, 0.08)",
          }}
        >
          {state.error}
        </Alert>
      </Collapse>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <StyledTextField
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
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <CheckCircle
                      sx={{
                        fontSize: 20,
                        color:
                          email && !emailError
                            ? "#00d4d4"
                            : "rgba(0,0,0,0.1)",
                        transition: "all 0.3s ease",
                      }}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />

          <StyledTextField
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
            helperText={passwordError}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{
                        color: "#00b8b8",
                        transition: "all 0.2s ease",
                        "&:hover": { color: "#008888" },
                      }}
                    >
                      {showPassword ? (
                        <VisibilityOff sx={{ fontSize: 20 }} />
                      ) : (
                        <Visibility sx={{ fontSize: 20 }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {forSignUp && (
            <StyledTextField
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
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                        sx={{
                          color: "#00b8b8",
                          transition: "all 0.2s ease",
                          "&:hover": { color: "#008888" },
                        }}
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff sx={{ fontSize: 20 }} />
                        ) : (
                          <Visibility sx={{ fontSize: 20 }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}

          {!forSignUp && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: -1,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{
                      color: "#cbd5e0",
                      "&.Mui-checked": { color: "#00d4d4" },
                      "& .MuiSvgIcon-root": { fontSize: 20 },
                    }}
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    sx={{ color: "#718096", fontSize: "13px" }}
                  >
                    Remember me
                  </Typography>
                }
              />
              <Typography
                variant="body2"
                sx={{
                  color: "#00b8b8",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "color 0.2s ease",
                  "&:hover": { color: "#008888" },
                }}
              >
                Forgot password?
              </Typography>
            </Box>
          )}

          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            disabled={state.loading}
            sx={{
              mt: 1,
              animation: state.loading ? "none" : `${pulse} 2s ease-in-out infinite`,
              "&:hover": {
                animation: "none",
              },
            }}
          >
            {state.loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : forSignUp ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </SubmitButton>

          {/* Mobile-only toggle link */}
          {isMobile && (
            <Box sx={{ textAlign: "center", mt: 1 }}>
              <Typography variant="body2" sx={{ color: "#718096" }}>
                {forSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <Box
                  component="span"
                  onClick={handleToggle}
                  sx={{
                    color: "#00b8b8",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "color 0.2s ease",
                    "&:hover": { color: "#008888" },
                  }}
                >
                  {forSignUp ? "Sign In" : "Sign Up"}
                </Box>
              </Typography>
            </Box>
          )}
        </Box>
      </form>
    </Box>
  );

  // --------------- Mobile Layout ---------------
  if (isMobile) {
    return (
      <Box
        sx={{
          width: "100vw",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #f0f4f8 0%, #e2e8f0 100%)",
          p: 3,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "440px",
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            p: 4,
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
          }}
        >
          {renderForm(isSignUp)}
        </Box>
      </Box>
    );
  }

  // --------------- Desktop Layout (Double Slider) ---------------
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, #f0f4f8 0%, #e2e8f0 50%, #dfe6ed 100%)",
        overflow: "hidden",
      }}
    >
      {/* Main Card Container */}
      <Box
        sx={{
          position: "relative",
          width: "min(1000px, 90vw)",
          height: "min(640px, 85vh)",
          borderRadius: "28px",
          overflow: "hidden",
          boxShadow:
            "0 25px 80px rgba(0, 0, 0, 0.12), 0 8px 32px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* ---- Sign Up Form (Left Side) ---- */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "50%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(20px)",
            px: 5,
            py: 4,
            opacity: isSignUp ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
            transitionDelay: isSignUp ? "0.35s" : "0s",
            pointerEvents: isSignUp ? "auto" : "none",
          }}
        >
          {renderForm(true)}
        </Box>

        {/* ---- Sign In Form (Right Side) ---- */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "50%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(20px)",
            px: 5,
            py: 4,
            opacity: isSignUp ? 0 : 1,
            transition: "opacity 0.5s ease-in-out",
            transitionDelay: isSignUp ? "0s" : "0.35s",
            pointerEvents: isSignUp ? "none" : "auto",
          }}
        >
          {renderForm(false)}
        </Box>

        {/* ---- Sliding Overlay Panel ---- */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "50%",
            height: "100%",
            zIndex: 100,
            transform: isSignUp ? "translateX(100%)" : "translateX(0)",
            transition:
              "transform 0.8s cubic-bezier(0.65, 0, 0.35, 1), clip-path 0.8s cubic-bezier(0.65, 0, 0.35, 1)",
            clipPath: isSignUp
              ? "polygon(12% 0, 100% 0, 100% 100%, 0 100%)"
              : "polygon(0 0, 100% 0, 88% 100%, 0 100%)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            /* Blurred focustrack.jpg background */
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
              filter: "blur(12px)",
              zIndex: 0,
            },

            /* Teal gradient overlay for readability */
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(160deg, rgba(0, 220, 220, 0.72) 0%, rgba(0, 180, 180, 0.82) 40%, rgba(0, 140, 140, 0.88) 100%)",
              zIndex: 1,
            },
          }}
        >
          {/* Overlay Content */}
          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              textAlign: "center",
              maxWidth: "380px",
              px: 4,
            }}
          >
            {/* Floating image card */}
            <Box
              component="img"
              src={focusTrackImage}
              alt="FocusTrack"
              sx={{
                width: "75%",
                maxWidth: "280px",
                borderRadius: "20px",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.35)",
                mb: 3,
                animation: `${float} 4s ease-in-out infinite`,
              }}
            />

            {/* Title */}
            <Typography
              variant="h4"
              sx={{
                color: "white",
                fontWeight: 800,
                mb: 1.5,
                textShadow: "0 2px 20px rgba(0, 0, 0, 0.2)",
                letterSpacing: "-0.5px",
                fontSize: "1.8rem",
              }}
            >
              FocusTrack Hub
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: "14px",
                lineHeight: 1.7,
                mb: 4,
                textShadow: "0 1px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              {isSignUp
                ? "Already part of the team? Sign in and pick up right where you left off."
                : "Start your journey to peak productivity. Create an account and take control of your time."}
            </Typography>

            {/* Toggle Button */}
            <OverlayToggleButton variant="outlined" onClick={handleToggle}>
              {isSignUp ? "Sign In" : "Sign Up"}
            </OverlayToggleButton>
          </Box>

          {/* Decorative floating circles */}
          <Box
            sx={{
              position: "absolute",
              top: "10%",
              left: "8%",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              border: "2px solid rgba(255, 255, 255, 0.15)",
              zIndex: 2,
              animation: `${float} 5s ease-in-out infinite`,
              animationDelay: "1s",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: "12%",
              right: "10%",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              zIndex: 2,
              animation: `${float} 6s ease-in-out infinite`,
              animationDelay: "2s",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "60%",
              left: "5%",
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              zIndex: 2,
              animation: `${float} 4.5s ease-in-out infinite`,
              animationDelay: "0.5s",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default AuthForm;
