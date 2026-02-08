import React from "react";
import { Box, Skeleton } from "@mui/material";

const LoadingState: React.FC = () => {
  return (
    <Box>
      {/* Stats skeleton */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: { xs: 2, md: 3 },
          mb: 4,
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <Box
            key={i}
            sx={{
              background: "rgba(255, 255, 255, 0.5)",
              borderRadius: "18px",
              border: "1px solid rgba(255, 255, 255, 0.8)",
              p: 3,
            }}
          >
            <Skeleton
              variant="rounded"
              width={48}
              height={48}
              sx={{ borderRadius: "14px", mb: 2 }}
            />
            <Skeleton variant="text" width="40%" height={36} />
            <Skeleton variant="text" width="60%" height={20} />
          </Box>
        ))}
      </Box>

      {/* Task cards skeleton */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: { xs: 2, md: 3 },
        }}
      >
        {[1, 2, 3].map((i) => (
          <Box
            key={i}
            sx={{
              background: "rgba(255, 255, 255, 0.5)",
              borderRadius: "18px",
              border: "1px solid rgba(255, 255, 255, 0.8)",
              p: 3,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Skeleton variant="text" width="60%" height={28} />
              <Skeleton
                variant="rounded"
                width={72}
                height={26}
                sx={{ borderRadius: "8px" }}
              />
            </Box>
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="text" width="70%" />
            <Skeleton
              variant="rounded"
              height={48}
              sx={{ mt: 2, borderRadius: "14px" }}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Skeleton variant="text" width="30%" />
              <Box sx={{ display: "flex", gap: 1 }}>
                <Skeleton variant="circular" width={32} height={32} />
                <Skeleton variant="circular" width={32} height={32} />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default LoadingState;
