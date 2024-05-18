import React from "react";
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <div>
      <Box>
        <Box height={100} />
        <Box backgroundColor="#222831" height="300">
          <Typography variant="h6" color="initial">
            This is Footer
          </Typography>
        </Box>
      </Box>
    </div>
  );
}
