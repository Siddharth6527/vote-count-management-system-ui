"use client";

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
  Avatar,
  Typography,
  Paper,
} from "@mui/material";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import ConstituencyAccordionContent from "../component/ConstituencyAccordionContent";
import CandidateImage from "../component/CandidateImage";
import { API_ROUNDS_URL } from "../utils/api";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { blue } from "@mui/material/colors";
export default function Home() {
  const [sort, setSort] = useState("candidateId");
  const [order, setOrder] = useState("asc");
  const [table, setTable] = useState(null);

  const [ROUNDID, setROUNDID] = useState(1);

  const [loading, setLoading] = useState(false);
  const [rounds, setRounds] = useState(null);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

  const fetchRounds = async (indicateLoading = true) => {
    if (indicateLoading) {
      setLoading(true);
    }

    console.log("Fetching rounds...");

    try {
      console.log(API_ROUNDS_URL + `?orderBy=${sort}&asc=${order == "asc"}`);
      const response = await fetch(
        API_ROUNDS_URL + `?orderBy=${sort}&asc=${order == "asc"}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.status == 200) {
        console.log(data);
        setRounds(data);
      } else {
        throw new Error();
      }
    } catch (e) {
      console.log(e);
      setErrorSnackbarOpen(true);
      setTimeout(() => setErrorSnackbarOpen(false), 10000);
    }
    if (indicateLoading) {
      setLoading(false);
    }
  };

  const [time, setTime] = useState(0);
  useEffect(() => {
    fetchRounds(false);

    const timer = setTimeout(() => {
      setTime(time + 1);
    }, 10000);
    return () => {
      clearTimeout(timer);
    };
  }, [time]);

  useEffect(() => {
    fetchRounds();
  }, [sort, order]);

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
      {!loading
        ? [
            <Typography variant="h6" component="div">
              Nainital
            </Typography>,
            <Box sx={{ height: 16 }} />,
            ...["Lalkuan", "Bhimtal", "Nainital", "Haldwani", "Kaladhungi"].map(
              (e) => (
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    {e}
                  </AccordionSummary>
                  <AccordionDetails>
                    <ConstituencyAccordionContent
                      rounds={rounds}
                      constituency={e}
                    />
                  </AccordionDetails>
                </Accordion>
              )
            ),
            <Box sx={{ height: 16 }} />,
            <Typography variant="h6" component="div">
              Udham Singh Nagar
            </Typography>,
            <Box sx={{ height: 16 }} />,
            ...[
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
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  {e}
                </AccordionSummary>
                <AccordionDetails>
                  <ConstituencyAccordionContent
                    rounds={rounds}
                    constituency={e}
                  />
                </AccordionDetails>
              </Accordion>
            )),
          ]
        : null}

      {loading ? (
        <Box
          sx={{
            flex: 1,
            width: "100%",
            flexDirection: "row",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress sx={{ width: "100%" }} />
        </Box>
      ) : null}

      <Snackbar
        open={errorSnackbarOpen}
        autoHideDuration={10000}
        onClose={() => setErrorSnackbarOpen(false)}
        message={"Refresh: Failure"}
      />
    </Box>
  );
}
