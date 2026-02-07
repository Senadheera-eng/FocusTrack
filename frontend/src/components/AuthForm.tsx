import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  Person,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Import the image - you'll need to place focustrack.jpg in your src/assets folder
import focusTrackImage from "../assets/focustrack.jpg";

interface AuthFormProps {
  isLogin: boolean;
}

// Styled components
const Container = styled(Box)({
  minHeight: "100vh",
  display: "flex",
  background: "linear-gradient(135deg, #f5f7fa 0%, #e3e8f0 100%)",
  position: "relative",
  overflow: "hidden",
});

const LeftPanel = styled(Box)(({ theme }) => ({
  flex: "0 0 50%",
  background: "linear-gradient(135deg, #00d4d4 0%, #00a8a8 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  clipPath: "polygon(0 0, 85% 0, 100% 100%, 0 100%)",
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
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

const ImageContainer = styled(Box)({
  position: "relative",
  zIndex: 1,
  maxWidth: "500px",
  width: "80%",
  textAlign: "center",
  "& img": {
    width: "100%",
    height: "auto",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    marginBottom: "32px",
  },
});

const RightPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const FormContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "450px",
  padding: theme.spacing(5, 4),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3, 2),
  },
}));

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "#fff",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#fafafa",
    },
    "&.Mui-focused": {
      backgroundColor: "#fff",
      "& fieldset": {
        borderColor: "#00d4d4",
        borderWidth: "2px",
      },
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#00d4d4",
  },
});

const StyledButton = styled(Button)({
  borderRadius: "8px",
  padding: "14px 32px",
  fontSize: "16px",
  fontWeight: 600,
  textTransform: "none",
  background: "linear-gradient(135deg, #00d4d4 0%, #00a8a8 100%)",
  boxShadow: "0 4px 14px rgba(0, 212, 212, 0.4)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(135deg, #00a8a8 0%, #008888 100%)",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(0, 212, 212, 0.5)",
  },
  "&:disabled": {
    background: "#ccc",
  },
});

const AuthForm: React.FC<AuthFormProps> = ({ isLogin }) => {
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

  // Validate email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Username is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email");
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

      if (!state.error) {
        navigate("/dashboard");
      }
    } catch (error) {
      // Error handled by AuthContext
    }
  };

  return (
    <Container>
      {/* Left Panel with Image */}
      <LeftPanel>
        <ImageContainer>
          <img src={focusTrackImage} alt="Time Management" />
          <Typography
            variant="h3"
            sx={{
              color: "white",
              fontWeight: 700,
              mb: 2,
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            FocusTrack Hub
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255, 255, 255, 0.95)",
              fontSize: "16px",
              lineHeight: 1.6,
              maxWidth: "400px",
              margin: "0 auto",
              textShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            Unleash Your Productivity Potential with FocusTrack's Time
            Management Excellence Platform
          </Typography>
        </ImageContainer>
      </LeftPanel>

      {/* Right Panel with Form */}
      <RightPanel>
        <FormContainer>
          {/* Header */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 300,
              color: "#2d3748",
              mb: 1,
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            {isLogin ? "LOGIN" : "SIGN UP"}
          </Typography>

          {/* Error Alert */}
          <Collapse in={!!state.error}>
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: "8px" }}
              onClose={() => {}}
            >
              {state.error}
            </Alert>
          </Collapse>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ mt: 4 }}>
              {/* Username/Email Field */}
              <StyledTextField
                fullWidth
                label="Username"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) validateEmail(e.target.value);
                }}
                onBlur={() => validateEmail(email)}
                error={!!emailError}
                helperText={emailError}
                sx={{ mb: 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CheckCircle
                        sx={{
                          color: email && !emailError ? "#00d4d4" : "#ccc",
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Password Field */}
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
                sx={{ mb: isLogin ? 2 : 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: "#00d4d4" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Confirm Password (Register Only) */}
              {!isLogin && (
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
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                          sx={{ color: "#00d4d4" }}
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}

              {/* Remember Me (Login Only) */}
              {isLogin && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={{
                        color: "#00d4d4",
                        "&.Mui-checked": {
                          color: "#00d4d4",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      Agree to remember the password.
                    </Typography>
                  }
                  sx={{ mb: 3 }}
                />
              )}

              {/* Submit Button */}
              <StyledButton
                type="submit"
                fullWidth
                variant="contained"
                disabled={state.loading}
                sx={{ mb: 3 }}
              >
                {state.loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : isLogin ? (
                  "SIGN IN"
                ) : (
                  "CREATE ACCOUNT"
                )}
              </StyledButton>

              {/* Toggle Link */}
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  {isLogin ? "No account?" : "Already have an account?"}{" "}
                  <Link
                    to={isLogin ? "/register" : "/login"}
                    style={{
                      color: "#00d4d4",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    {isLogin ? "Sign Up" : "Sign In"}
                  </Link>
                </Typography>
              </Box>
            </Box>
          </form>
        </FormContainer>
      </RightPanel>
    </Container>
  );
};

export default AuthForm;
