"use client";

import Link from "next/link";
import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  MenuItem,
  Snackbar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Card,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import CandidateImage from "../component/CandidateImage";
import { API_ROUNDS_URL } from "../utils/api";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

export default function Constituency() {
  return (
    <Box
      sx={{
        p: 2,
        flex: 1,
        overflow: "scroll",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch",
      }}
    >
      <Typography variant="h6" component="div">
        Nainital
      </Typography>
      {["Lalkuan", "Bhimtal", "Nainital", "Haldwani", "Kaladhungi"].map((e) => (
        <Link href={`constituency/${e}`}>
          <Typography variant="body1" component="div">
            {e}
          </Typography>
        </Link>
      ))}
      <Box sx={{ height: 16 }} />
      <Typography variant="h6" component="div">
        Udham Singh Nagar
      </Typography>
      {[
        "Jaspur",
        "Kashipur",
        "Bajpur",
        "Gadarpur",
        "Rudrapur",
        "Kiccha",
        "Sitarganj",
        "Nanakmatta",
        "Khatima",
      ].map((e) => (
        <Link href={`constituency/${e}`}>
          <Typography variant="body1" component="div">
            {e}
          </Typography>
        </Link>
      ))}
    </Box>
  );
}
