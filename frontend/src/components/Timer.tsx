import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography, Tooltip } from "@mui/material";
import { PlayArrow, Stop, Timer as TimerIcon } from "@mui/icons-material";
import { keyframes } from "@mui/material/styles";
import axios from "axios";

interface TimerProps {
  taskId: string;
  onTimeUpdate?: () => void;
}

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const Timer: React.FC<TimerProps> = ({ taskId, onTimeUpdate }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkActiveTimer();
    fetchTotalTime();
  }, [taskId]);

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
        setIsRunning(true);
        setStartTime(new Date(res.data.startTime));
      }
    } catch {
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

      await fetchTotalTime();

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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          p: 1.5,
          borderRadius: "14px",
          background: isRunning
            ? "rgba(239, 68, 68, 0.04)"
            : "rgba(8, 145, 178, 0.04)",
          border: `1px solid ${isRunning ? "rgba(239, 68, 68, 0.12)" : "rgba(8, 145, 178, 0.1)"}`,
          transition: "all 0.3s ease",
        }}
      >
        <TimerIcon
          sx={{
            color: isRunning ? "#ef4444" : "#0891b2",
            fontSize: 18,
            ...(isRunning && { animation: `${pulse} 1.5s ease-in-out infinite` }),
          }}
        />

        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: isRunning ? "#ef4444" : "#64748b",
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: "14px",
            letterSpacing: "0.5px",
            flex: 1,
          }}
        >
          {isRunning ? formatTime(elapsedSeconds) : "00:00:00"}
        </Typography>

        {isRunning ? (
          <Tooltip title="Stop Timer">
            <IconButton
              size="small"
              onClick={handleStop}
              disabled={loading}
              sx={{
                width: 32,
                height: 32,
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                  transform: "scale(1.08)",
                },
                "&:disabled": { background: "#ccc" },
                transition: "all 0.2s ease",
              }}
            >
              <Stop sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Start Timer">
            <IconButton
              size="small"
              onClick={handleStart}
              disabled={loading}
              sx={{
                width: 32,
                height: 32,
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(135deg, #059669, #047857)",
                  transform: "scale(1.08)",
                },
                "&:disabled": { background: "#ccc" },
                transition: "all 0.2s ease",
              }}
            >
              <PlayArrow sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Total Time Display */}
      {totalSeconds > 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            px: 1.5,
            py: 0.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "#0891b2",
              fontWeight: 600,
              fontSize: "11.5px",
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
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
