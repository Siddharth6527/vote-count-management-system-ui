"use client";

import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import CandidateImage from "./component/CandidateImage";
import { API_ROUNDS_URL } from "./utils/api";

export default function Home() {
  const [sort, setSort] = useState("candidateId");
  const [order, setOrder] = useState("asc");

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
        alignItems: "flex-start",
      }}
    >
      <Box sx={{ height: 16 }} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="div">
          Results
        </Typography>
      </Box>
      <Box sx={{ height: 32 }} />{" "}
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <FormControl>
          <InputLabel id="sort-label">Sort</InputLabel>
          <Select
            id="sort-select"
            labelId="sort-label"
            value={sort}
            variant="outlined"
            label="Sort"
            onChange={(e) => {
              setSort(e.target.value);
            }}
          >
            <MenuItem value={"candidateId"}>Default</MenuItem>
            <MenuItem value={"candidateName"}>Candidate Name</MenuItem>
            <MenuItem value={"candidateParty"}>Candidate Party</MenuItem>
            <MenuItem value={"voteCount"}>Vote Count</MenuItem>
          </Select>{" "}
        </FormControl>

        <Box sx={{ width: 16 }} />
        <FormControl>
          <InputLabel id="order-label">Order</InputLabel>
          <Select
            id="order-select"
            labelId="order-label"
            value={order}
            variant="outlined"
            label="Order"
            onChange={(e) => {
              setOrder(e.target.value);
            }}
          >
            <MenuItem value={"asc"}>Ascending</MenuItem>
            <MenuItem value={"desc"}>Descending</MenuItem>
          </Select>{" "}
        </FormControl>
      </Box>
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
      <Box sx={{ height: 32 }} />
      {rounds != null && !loading && rounds?.length > 0 ? (
        <Card
          sx={{
            width: {
              md: "100%",
            },
            overflow: {
              xs: "visible",
              md: "100%",
            },
            whiteSpace: "nowrap",
          }}
          elevation={2}
        >
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell size="small">Round Number</TableCell>
                  <TableCell>Round District</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(() => {
                  try {
                    return rounds.map((round) => {
                      return (
                        <React.Fragment>
                          <TableRow
                            key={`${round.roundId}-${round.roundDistrict}`}
                            sx={{
                              "*": { border: "unset" },
                            }}
                          >
                            <TableCell size="small">{round.roundId}</TableCell>
                            <TableCell>{round.roundDistrict}</TableCell>
                          </TableRow>
                          <TableCell colSpan={3}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                flexWrap: "wrap",
                              }}
                            >
                              {round.candidateVoteCounts.map((e) => (
                                <Chip
                                  sx={{
                                    marginRight: 1,
                                    marginBottom: 1,
                                    paddingLeft: 1,
                                  }}
                                  avatar={
                                    <CandidateImage
                                      width={20}
                                      height={20}
                                      id={e.candidate.candidateId}
                                    />
                                  }
                                  label={`${e.candidate.candidateName} : ${e.voteCount} votes`}
                                  key={e.candidate.candidateId}
                                />
                              ))}
                            </Box>
                          </TableCell>
                        </React.Fragment>
                      );
                    });
                  } catch (e) {
                    console.log(e);
                    return null;
                  }
                })()}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      ) : null}
      {rounds?.length == 0 && !loading ? (
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
          {" "}
          <Typography variant="body2" component="div">
            No rounds found.
          </Typography>
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
