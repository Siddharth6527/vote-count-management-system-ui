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
  Paper,
} from "@mui/material";
import CandidateImage from "./component/CandidateImage";
import { API_ROUNDS_URL } from "./utils/api";

import { BarChart } from "@mui/x-charts/BarChart";

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
        <TableContainer
          sx={{ whiteSpace: "nowrap" }}
          className="result"
          component={Paper}
        >
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell size="small" align="center">
                  &nbsp;
                </TableCell>
                <TableCell align="center">&nbsp;</TableCell>
                {rounds.map((round) => {
                  return (
                    <TableCell
                      sx={{ maxLines: 2 }}
                      align="center"
                      key={`Round\n${round.roundId}\n(${round.roundDistrict})\n(${round.roundConstituency})`}
                    >
                      {`Round ${round.roundId}`}
                      <br />
                      {`(${round.roundDistrict})`}
                      <br />
                      {`(${round.roundConstituency})`}
                    </TableCell>
                  );
                })}
                <TableCell align="center">
                  &nbsp;&nbsp;&nbsp;&nbsp;Total&nbsp;&nbsp;&nbsp;&nbsp;
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(() => {
                try {
                  const round = rounds[0];
                  return (
                    <React.Fragment>
                      {round.candidateVoteCounts.map((e) => {
                        const candidate = e.candidate;
                        return (
                          <TableRow key={candidate.candidateId}>
                            <TableCell align="center">
                              <CandidateImage
                                height={24}
                                id={candidate.candidateId}
                              />
                            </TableCell>
                            <TableCell align="center">
                              {candidate.candidateName}
                              <br />
                              <Chip
                                label={candidate.candidateParty}
                                variant="outlined"
                              />
                            </TableCell>
                            {rounds.map((round) => {
                              return (
                                <TableCell
                                  key={`${round.roundId}-${round.roundDistrict}`}
                                  id={`${round.roundId}-${round.roundDistrict}`}
                                  align="center"
                                >
                                  {round.candidateVoteCounts.find(
                                    (c) =>
                                      c.candidate.candidateId ==
                                      candidate.candidateId
                                  )?.voteCount || 0}
                                </TableCell>
                              );
                            })}
                            <TableCell align="center">
                              {rounds.reduce(
                                (acc, round) =>
                                  acc +
                                  round.candidateVoteCounts.find(
                                    (c) =>
                                      c.candidate.candidateId ==
                                      candidate.candidateId
                                  )?.voteCount,
                                0
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </React.Fragment>
                  );
                } catch (e) {
                  console.log(e);
                  return null;
                }
              })()}
            </TableBody>
          </Table>
        </TableContainer>
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
      <Box sx={{ height: 32 }} />
      {rounds != null && !loading && rounds?.length > 0 ? (
        <BarChart
          sx={{ padding: 1 }}
          width="1200"
          height="800"
          xAxis={[
            {
              scaleType: "band",
              data: rounds[0].candidateVoteCounts.map((e) => {
                return `${e.candidate.candidateName} (${e.candidate.candidateParty})`;
              }),
            },
          ]}
          series={rounds.map((round) => {
            return {
              stack: "total",
              data: round.candidateVoteCounts.map((e) => e.voteCount),
            };
          })}
        />
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
