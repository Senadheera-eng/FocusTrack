import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography, Tooltip } from "@mui/material";
import { PlayArrow, Stop, Timer as TimerIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import axios from "axios";

interface TimerProps {
  taskId: string;
  onTimeUpdate?: () => void;
}

const TimerContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  borderRadius: "12px",
  backgroundColor: "rgba(0, 212, 212, 0.05)",
  border: "1px solid rgba(0, 212, 212, 0.2)",
}));

const PlayButton = styled(IconButton)({
  background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
  color: "white",
  padding: "8px",
  "&:hover": {
    background: "linear-gradient(135deg, #45a049 0%, #3d8b40 100%)",
    transform: "scale(1.05)",
  },
  "&:disabled": {
    background: "#ccc",
  },
  transition: "all 0.3s ease",
});

const StopButton = styled(IconButton)({
  background: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
  color: "white",
  padding: "8px",
  "&:hover": {
    background: "linear-gradient(135deg, #d32f2f 0%, #c62828 100%)",
    transform: "scale(1.05)",
  },
  "&:disabled": {
    background: "#ccc",
  },
  transition: "all 0.3s ease",
});

const Timer: React.FC<TimerProps> = ({ taskId, onTimeUpdate }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [loading, setLoading] = useState(false);

  // Check if there's an active timer on mount
  useEffect(() => {
    checkActiveTimer();
    fetchTotalTime();
  }, [taskId]);

  // Update elapsed time every second when timer is running
  useEffect(() => {
    let interval: number | null = null;

    if (isRunning && startTime) {
      interval = window.setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedSeconds(diff);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, startTime]);

  const checkActiveTimer = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/time-entries/task/${taskId}/active`,
      );
      if (res.data) {
        // Active timer exists
        setIsRunning(true);
        setStartTime(new Date(res.data.startTime));
      }
    } catch (err) {
      // No active timer
      setIsRunning(false);
    }
  };

  const fetchTotalTime = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/time-entries/task/${taskId}/total`,
      );
      setTotalSeconds(res.data.totalSeconds || 0);
    } catch (err) {
      console.error("Failed to fetch total time:", err);
    }
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:4000/time-entries/task/${taskId}/start`,
      );
      setIsRunning(true);
      setStartTime(new Date(res.data.startTime));
      setElapsedSeconds(0);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to start timer");
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    try {
      await axios.post(
        `http://localhost:4000/time-entries/task/${taskId}/stop`,
      );
      setIsRunning(false);
      setStartTime(null);
      setElapsedSeconds(0);

      // Refresh total time
      await fetchTotalTime();

      // Notify parent component
      if (onTimeUpdate) {
        onTimeUpdate();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to stop timer");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {/* Timer Controls */}
      <TimerContainer>
        <TimerIcon sx={{ color: "#00d4d4", fontSize: 20 }} />

        {isRunning ? (
          <>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: "#f44336",
                fontFamily: "monospace",
                fontSize: "14px",
              }}
            >
              {formatTime(elapsedSeconds)}
            </Typography>
            <Tooltip title="Stop Timer">
              <StopButton size="small" onClick={handleStop} disabled={loading}>
                <Stop fontSize="small" />
              </StopButton>
            </Tooltip>
          </>
        ) : (
          <>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: "#666",
                fontFamily: "monospace",
                fontSize: "14px",
              }}
            >
              00:00:00
            </Typography>
            <Tooltip title="Start Timer">
              <PlayButton size="small" onClick={handleStart} disabled={loading}>
                <PlayArrow fontSize="small" />
              </PlayButton>
            </Tooltip>
          </>
        )}
      </TimerContainer>

      {/* Total Time Display */}
      {totalSeconds > 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            py: 0.5,
            borderRadius: "8px",
            backgroundColor: "rgba(0, 212, 212, 0.1)",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "#00a8a8",
              fontWeight: 600,
            }}
          >
            Total: {formatTime(totalSeconds)}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Timer;
