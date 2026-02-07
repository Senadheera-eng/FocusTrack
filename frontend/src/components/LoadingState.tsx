import React from "react";
import { Box, Card, CardContent, Skeleton } from "@mui/material";

const LoadingState: React.FC = () => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "repeat(3, 1fr)",
        },
        gap: 3,
      }}
    >
      {[1, 2, 3].map((i) => (
        <Card sx={{ borderRadius: "16px" }} key={i}>
          <CardContent>
            <Skeleton variant="text" height={32} />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="rectangular" height={40} sx={{ mt: 2 }} />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default LoadingState;
