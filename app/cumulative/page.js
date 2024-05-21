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
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
      {/* <Box sx={{ height: 16 }} />
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
      </Box> */}
      {!loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",

            flexWrap: "wrap",
          }}
        >
          {Array.from(Array(20).keys()).map((i) => {
            return (
              <React.Fragment>
                <div
                  onClick={() => {
                    setROUNDID(i + 1);
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: ROUNDID == i + 1 ? blue[800] : blue[200],
                      marginTop: 2,
                    }}
                  >
                    {i + 1}
                  </Avatar>
                </div>{" "}
                <Box sx={{ width: "16px" }} />
              </React.Fragment>
            );
          })}
        </Box>
      ) : null}
      {!loading
        ? [
            <Box sx={{ height: "16px" }} />,
            <Typography variant="h6" component="div">
              Round {ROUNDID}
            </Typography>,
            <Box sx={{ height: "16px" }} />,
          ]
        : null}
      {}
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
      {rounds != null && !loading && rounds?.length > 0
        ? (() => {
            const columns = [
              {
                width: "100",
                accessorKey: "candidateImage",
                header: "",
                size: 100,
              },
              {
                width: "auto",
                accessorKey: "candidateName",
                header: "Candidate Name",
                grow: true,
              },
              {
                width: "auto",
                accessorKey: "candidateParty",
                header: "Candidate Party",
                grow: true,
              },
              {
                width: "auto",
                accessorKey: "voteBroughtFromPreviousRounds",
                header: "Vote Brought From Previous Rounds",
                size: 400,
              },
              {
                width: "auto",
                accessorKey: "currentRound",
                header: "Current Round",
                size: 200,
              },
              {
                width: "auto",
                accessorKey: "total",
                header: "Total",
                size: 200,
              },
            ];
            const data = [];
            for (let i = 0; i < rounds[0].candidateVoteCounts.length; i++) {
              let voteBroughtFromPreviousRounds = (() => {
                let result = rounds
                  .filter((round) => round.roundId < ROUNDID)
                  .reduce((acc, round) => {
                    return acc + round.candidateVoteCounts[i].voteCount;
                  }, 0);
                console.log(result);
                return result;
              })();
              let currentRound = rounds
                .filter((round) => round.roundId == ROUNDID)
                .reduce((acc, round) => {
                  return acc + round.candidateVoteCounts[i].voteCount;
                }, 0);
              let row = {
                candidateId:
                  rounds[0].candidateVoteCounts[i].candidate.candidateId,
                candidateImage: (
                  <CandidateImage
                    id={rounds[0].candidateVoteCounts[i].candidate.candidateId}
                    width={28}
                    height={28}
                  />
                ),
                candidateName:
                  rounds[0].candidateVoteCounts[i].candidate.candidateName,
                candidateParty:
                  rounds[0].candidateVoteCounts[i].candidate.candidateParty,
                voteBroughtFromPreviousRounds,
                currentRound,
                total: voteBroughtFromPreviousRounds + currentRound,
              };

              data.push(row);
            }

            console.log(data);
            console.log(columns);

            // const table = useMaterialReactTable({
            //   enableColumnPinning: true,
            //   layoutMode: "grid-no-grow",
            //   data: data,
            //   columns: columns,

            //   initialState: {
            //     columnPinning: {
            //       left: ["candidateImage", "candidateName"],
            //       right: ["total"],
            //     },
            //   },
            // });

            return (
              <MaterialReactTable
                enableDensityToggle={false}
                enableSelectAll={false}
                enableFilters={false}
                enableHiding={false}
                enableFullScreenToggle={false}
                enableTopToolbar={false}
                enableBottomToolbar={false}
                enableColumnActions={false}
                // enableColumnActions={true}
                muiTableHeadCellProps={{
                  whiteSpace: "nowrap",
                  maxLines: 3,
                }}
                data={data}
                enablePagination={false}
                enableColumnPinning={true}
                columns={columns}
              />
            );
          })()
        : null}
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
