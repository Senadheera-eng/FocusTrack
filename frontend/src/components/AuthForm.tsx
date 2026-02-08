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

// ======================== KEYFRAME ANIMATIONS ========================

const gradientShift = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`;

const floatSlow = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(10px, -20px) rotate(5deg); }
  50% { transform: translate(-5px, -35px) rotate(-3deg); }
  75% { transform: translate(-15px, -15px) rotate(2deg); }
`;

const floatMedium = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(-20px, -15px) rotate(-8deg); }
  66% { transform: translate(15px, -30px) rotate(6deg); }
`;

const floatFast = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(10px, -25px) scale(1.05); }
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

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 212, 212, 0.4); }
  50% { box-shadow: 0 0 0 14px rgba(0, 212, 212, 0); }
`;

// ======================== STYLED COMPONENTS ========================

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.85)",
      boxShadow: "0 4px 20px rgba(0, 212, 212, 0.06)",
    },
    "&.Mui-focused": {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      boxShadow: "0 4px 24px rgba(0, 212, 212, 0.12)",
      "& fieldset": {
        borderColor: "#00d4d4",
        borderWidth: "2px",
      },
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#0891b2",
  },
});

const SubmitButton = styled(Button)({
  borderRadius: "14px",
  padding: "14px 32px",
  fontSize: "15px",
  fontWeight: 700,
  textTransform: "none",
  letterSpacing: "0.3px",
  background:
    "linear-gradient(135deg, #00d4d4 0%, #0891b2 50%, #0e7490 100%)",
  backgroundSize: "200% 200%",
  boxShadow: "0 4px 20px rgba(0, 212, 212, 0.3)",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    backgroundPosition: "100% 100%",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 30px rgba(0, 212, 212, 0.4)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
  "&:disabled": {
    background: "linear-gradient(135deg, #cbd5e1, #94a3b8)",
    boxShadow: "none",
  },
});

const SocialButton = styled(IconButton)({
  width: "50px",
  height: "50px",
  border: "1.5px solid rgba(0, 0, 0, 0.06)",
  borderRadius: "14px",
  backgroundColor: "rgba(255, 255, 255, 0.6)",
  backdropFilter: "blur(8px)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderColor: "#00d4d4",
    transform: "translateY(-3px)",
    boxShadow: "0 8px 24px rgba(0, 212, 212, 0.12)",
  },
});

// ======================== FLOATING SHAPES ========================

const FloatingShapes: React.FC = () => (
  <>
    {/* Large morphing blob */}
    <Box
      sx={{
        position: "absolute",
        top: "8%",
        left: "10%",
        width: "140px",
        height: "140px",
        background: "rgba(255, 255, 255, 0.07)",
        animation: `${morphBlob} 8s ease-in-out infinite, ${floatSlow} 12s ease-in-out infinite`,
        zIndex: 2,
      }}
    />

    {/* Rotating ring */}
    <Box
      sx={{
        position: "absolute",
        top: "15%",
        right: "15%",
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        border: "2px solid rgba(255, 255, 255, 0.12)",
        animation: `${rotateGentle} 20s linear infinite, ${floatMedium} 10s ease-in-out infinite`,
        zIndex: 2,
      }}
    />

    {/* Small solid circle */}
    <Box
      sx={{
        position: "absolute",
        bottom: "20%",
        left: "18%",
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        background: "rgba(255, 255, 255, 0.12)",
        animation: `${floatFast} 6s ease-in-out infinite`,
        animationDelay: "1s",
        zIndex: 2,
      }}
    />

    {/* Medium glass circle */}
    <Box
      sx={{
        position: "absolute",
        bottom: "30%",
        right: "12%",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(4px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        animation: `${floatSlow} 9s ease-in-out infinite`,
        animationDelay: "2s",
        zIndex: 2,
      }}
    />

    {/* Rounded square */}
    <Box
      sx={{
        position: "absolute",
        top: "55%",
        left: "8%",
        width: "40px",
        height: "40px",
        borderRadius: "12px",
        border: "1.5px solid rgba(255, 255, 255, 0.1)",
        animation: `${rotateGentle} 15s linear infinite reverse, ${floatMedium} 11s ease-in-out infinite`,
        animationDelay: "0.5s",
        zIndex: 2,
      }}
    />

    {/* Tiny dots */}
    <Box
      sx={{
        position: "absolute",
        top: "35%",
        left: "35%",
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        background: "rgba(255, 255, 255, 0.2)",
        animation: `${floatFast} 5s ease-in-out infinite`,
        animationDelay: "3s",
        zIndex: 2,
      }}
    />
    <Box
      sx={{
        position: "absolute",
        top: "75%",
        right: "30%",
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        background: "rgba(255, 255, 255, 0.15)",
        animation: `${floatMedium} 7s ease-in-out infinite`,
        animationDelay: "1.5s",
        zIndex: 2,
      }}
    />

    {/* Large ring bottom */}
    <Box
      sx={{
        position: "absolute",
        bottom: "5%",
        left: "30%",
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        border: "1.5px solid rgba(255, 255, 255, 0.06)",
        animation: `${floatSlow} 14s ease-in-out infinite`,
        animationDelay: "4s",
        zIndex: 2,
      }}
    />
  </>
);

// ======================== MAIN COMPONENT ========================

const AuthForm: React.FC<AuthFormProps> = ({ isLogin: initialIsLogin }) => {
  const [isSignUp, setIsSignUp] = useState(!initialIsLogin);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const { state, login, register } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // ---------------- Validation ----------------
  const validateName = (value: string): boolean => {
    if (!value.trim()) {
      setNameError("Name is required");
      return false;
    }
    setNameError("");
    return true;
  };

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

  // ---------------- Handlers ----------------
  const handleToggle = () => {
    setIsSignUp((prev) => {
      const next = !prev;
      window.history.replaceState(null, "", next ? "/register" : "/login");
      return next;
    });
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    let isNameValid = true;
    let isConfirmValid = true;

    if (isSignUp) {
      isNameValid = validateName(name);
      isConfirmValid = validateConfirmPassword(confirmPassword);
    }

    if (!isEmailValid || !isPasswordValid || !isNameValid || !isConfirmValid)
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

  // ======================== FORM RENDERER ========================

  const renderForm = (forSignUp: boolean) => (
    <Box
      sx={{
        width: "100%",
        maxWidth: "420px",
        mx: "auto",
        animation: `${fadeInUp} 0.5s ease-out`,
      }}
    >
      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          color: "#0f172a",
          mb: 0.5,
          letterSpacing: "-0.5px",
          fontSize: { xs: "1.6rem", md: "2rem" },
        }}
      >
        {forSignUp ? "Create Account" : "Welcome Back"}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "#64748b",
          mb: 3.5,
          fontSize: "14.5px",
          lineHeight: 1.6,
        }}
      >
        {forSignUp
          ? "Begin your productivity journey today"
          : "Sign in to continue your focus session"}
      </Typography>

      {/* Social Login */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5, mb: 3 }}>
        <SocialButton>
          <Google sx={{ fontSize: 20, color: "#DB4437" }} />
        </SocialButton>
        <SocialButton>
          <GitHub sx={{ fontSize: 20, color: "#1f2937" }} />
        </SocialButton>
        <SocialButton>
          <Apple sx={{ fontSize: 20, color: "#000" }} />
        </SocialButton>
      </Box>

      {/* Divider */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
        <Box
          sx={{
            flex: 1,
            height: "1px",
            background: "linear-gradient(to right, transparent, #e2e8f0)",
          }}
        />
        <Typography
          variant="caption"
          sx={{
            color: "#94a3b8",
            fontSize: "11px",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          or continue with email
        </Typography>
        <Box
          sx={{
            flex: 1,
            height: "1px",
            background: "linear-gradient(to left, transparent, #e2e8f0)",
          }}
        />
      </Box>

      {/* Error Alert */}
      <Collapse in={!!state.error}>
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: "12px",
            backgroundColor: "rgba(239, 68, 68, 0.06)",
            "& .MuiAlert-icon": { color: "#ef4444" },
          }}
        >
          {state.error}
        </Alert>
      </Collapse>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Name (sign up only) */}
          {forSignUp && (
            <StyledTextField
              fullWidth
              label="Full Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) validateName(e.target.value);
              }}
              onBlur={() => validateName(name)}
              error={!!nameError}
              helperText={nameError}
            />
          )}

          {/* Email */}
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
                        fontSize: 18,
                        color:
                          email && !emailError
                            ? "#00d4d4"
                            : "rgba(0,0,0,0.08)",
                        transition: "all 0.3s ease",
                      }}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Password */}
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
                        color: "#94a3b8",
                        "&:hover": { color: "#0891b2" },
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

          {/* Confirm Password (sign up only) */}
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
                          color: "#94a3b8",
                          "&:hover": { color: "#0891b2" },
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

          {/* Remember me / Forgot password (sign in only) */}
          {!forSignUp && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: -0.5,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{
                      color: "#cbd5e1",
                      "&.Mui-checked": { color: "#0891b2" },
                      "& .MuiSvgIcon-root": { fontSize: 20 },
                    }}
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    sx={{ color: "#64748b", fontSize: "13px" }}
                  >
                    Remember me
                  </Typography>
                }
              />
              <Typography
                variant="body2"
                sx={{
                  color: "#0891b2",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "color 0.2s ease",
                  "&:hover": { color: "#0e7490" },
                }}
              >
                Forgot password?
              </Typography>
            </Box>
          )}

          {/* Submit */}
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            disabled={state.loading}
            sx={{
              mt: 0.5,
              animation: state.loading
                ? "none"
                : `${pulseGlow} 2.5s ease-in-out infinite`,
              "&:hover": { animation: "none" },
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

          {/* Toggle link */}
          <Box sx={{ textAlign: "center", mt: 1 }}>
            <Typography
              variant="body2"
              sx={{ color: "#64748b", fontSize: "13.5px" }}
            >
              {forSignUp
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <Box
                component="span"
                onClick={handleToggle}
                sx={{
                  color: "#0891b2",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "color 0.2s ease",
                  "&:hover": { color: "#0e7490" },
                }}
              >
                {forSignUp ? "Sign In" : "Sign Up"}
              </Box>
            </Typography>
          </Box>
        </Box>
      </form>
    </Box>
  );

  // ======================== MOBILE LAYOUT ========================

  if (isMobile) {
    return (
      <Box
        sx={{
          width: "100vw",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "#f8fafc",
        }}
      >
        {/* Compact animated branding header */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            py: 5,
            px: 3,
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: "-20px",
              left: "-20px",
              right: "-20px",
              bottom: "-20px",
              backgroundImage: `url(${focusTrackImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(15px)",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(-45deg, #00d4d4, #0891b2, #0e7490, #14b8a6)",
              backgroundSize: "300% 300%",
              animation: `${gradientShift} 10s ease infinite`,
              opacity: 0.85,
            },
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            <Typography
              variant="h5"
              sx={{ color: "white", fontWeight: 800, letterSpacing: "-0.5px" }}
            >
              FocusTrack Hub
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.8)",
                mt: 0.5,
                fontSize: "13px",
              }}
            >
              Time Management Excellence Platform
            </Typography>
          </Box>
        </Box>

        {/* Form area */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            px: 3,
            py: 4,
          }}
        >
          {renderForm(isSignUp)}
        </Box>
      </Box>
    );
  }

  // ======================== DESKTOP FULL-SCREEN SPLIT ========================

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "#f8fafc",
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
          px: { md: 4, lg: 8 },
          py: 4,
          overflowY: "auto",
          opacity: isSignUp ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
          transitionDelay: isSignUp ? "0.4s" : "0s",
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
          px: { md: 4, lg: 8 },
          py: 4,
          overflowY: "auto",
          opacity: isSignUp ? 0 : 1,
          transition: "opacity 0.5s ease-in-out",
          transitionDelay: isSignUp ? "0s" : "0.4s",
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
            ? "polygon(10% 0, 100% 0, 100% 100%, 0 100%)"
            : "polygon(0 0, 100% 0, 90% 100%, 0 100%)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          /* Blurred focustrack.jpg base layer */
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-40px",
            left: "-40px",
            right: "-40px",
            bottom: "-40px",
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
            opacity: 0.82,
            zIndex: 1,
          },
        }}
      >
        {/* Floating animated shapes */}
        <FloatingShapes />

        {/* Branding content */}
        <Box
          sx={{
            position: "relative",
            zIndex: 3,
            textAlign: "center",
            maxWidth: "380px",
            px: 4,
          }}
        >
          {/* Logo mark */}
          <Box
            sx={{
              width: "72px",
              height: "72px",
              borderRadius: "22px",
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
              animation: `${floatFast} 4s ease-in-out infinite`,
            }}
          >
            <Box
              component="span"
              sx={{
                background:
                  "linear-gradient(135deg, #fff, rgba(255,255,255,0.8))",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 900,
                fontSize: "28px",
                letterSpacing: "-1px",
              }}
            >
              FT
            </Box>
          </Box>

          {/* Title */}
          <Typography
            variant="h3"
            sx={{
              color: "white",
              fontWeight: 800,
              mb: 2,
              textShadow: "0 2px 20px rgba(0, 0, 0, 0.15)",
              letterSpacing: "-1px",
              fontSize: { md: "2rem", lg: "2.5rem" },
              lineHeight: 1.2,
            }}
          >
            FocusTrack Hub
          </Typography>

          {/* Dynamic subtitle */}
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255, 255, 255, 0.85)",
              fontSize: "15px",
              lineHeight: 1.7,
              mb: 5,
              maxWidth: "320px",
              mx: "auto",
            }}
          >
            {isSignUp
              ? "Already part of the team? Sign in and pick up right where you left off."
              : "Start your journey to peak productivity. Create an account and take control of your time."}
          </Typography>

          {/* Toggle Button */}
          <Button
            variant="outlined"
            onClick={handleToggle}
            sx={{
              color: "white",
              borderColor: "rgba(255, 255, 255, 0.5)",
              borderWidth: "2px",
              borderRadius: "50px",
              px: 5,
              py: 1.5,
              fontSize: "14px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "2px",
              backdropFilter: "blur(8px)",
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                borderColor: "white",
                borderWidth: "2px",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AuthForm;
