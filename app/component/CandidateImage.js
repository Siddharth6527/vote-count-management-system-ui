import { useState } from "react";
import { API_CANDIDATE_IMAGE_URL } from "../utils/api";
import { Groups } from "@mui/icons-material";
import { Box } from "@mui/material";

export default function CandidateImage({ id, width, height }) {
  const [error, setError] = useState(null);

  return error == null ? (
    <img
      style={{
        width: width,
        height: height,
        objectFit: "contain",
      }}
      onError={setError}
      src={API_CANDIDATE_IMAGE_URL + String(id)}
    />
  ) : (
    <Box
      sx={{
        width: width,
        height: height,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Groups
        sx={{
          fontSize: width,
        }}
      />
    </Box>
  );
}
