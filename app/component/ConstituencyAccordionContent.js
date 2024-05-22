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
import { blue, deepOrange } from "@mui/material/colors";

export default function ConstituencyAccordionContent({ rounds, constituency }) {
  const [ROUNDID, setROUNDID] = useState(1);
  // LOGIC FOR COLORED:
  // make a set
  let set = new Set();
  // Iterate through the rounds
  if (rounds != null && rounds.length != 0) {
    rounds.forEach((curr) => {
      if (curr.roundConstituency == constituency) {
        set.add(curr.roundId);
      }
    });
  }
  // and add rounds of that particular constituency only

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
      {/* FOR COLOUR DETAILS */}
      {/* PARENT CONTAINER */}
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", md: "center" },
          flexDirection: { xs: "column", md: "row", lg: "row" },
          justifyContent: "center",
          mb: 2,
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#51cf66",
              marginRight: 1,
            }}
          >
            {"A"}
          </Avatar>
          <Typography variant="body1" color="initial">
            : Round Available
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#fcc419",
              marginRight: 1,
            }}
          >
            {"B"}
          </Avatar>
          <Typography variant="body1" color="initial">
            : Round Not Available
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Avatar
            sx={{
              bgcolor: blue[800],
              marginRight: 1,
            }}
          >
            {"C"}
          </Avatar>
          <Typography variant="body1" color="initial">
            : Selected Round
          </Typography>
        </Box>
        <Box />
      </Box>
      {/* BUTTONS SECTION ENDS  */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          mb: 2,
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
                    // bgcolor: set.has(i + 1) ? "#51cf66" : "#fcc419",
                    bgcolor:
                      ROUNDID == i + 1
                        ? blue[800]
                        : set.has(i + 1)
                        ? "#51cf66"
                        : "#fcc419",
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
      {[
        <Box sx={{ height: "16px" }} />,
        <Typography variant="h6" component="div">
          Round {ROUNDID}
        </Typography>,
        <Box sx={{ height: "16px" }} />,
      ]}

      {rounds != null && rounds?.length > 0
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
                  .filter(
                    (round) =>
                      round.roundId < ROUNDID &&
                      round.roundConstituency == constituency
                  )
                  .reduce((acc, round) => {
                    return acc + round.candidateVoteCounts[i].voteCount;
                  }, 0);
                console.log(result);
                return result;
              })();
              let currentRound = rounds
                .filter(
                  (round) =>
                    round.roundId == ROUNDID &&
                    round.roundConstituency == constituency
                )
                .reduce((acc, round) => {
                  return acc + round.candidateVoteCounts[i].voteCount;
                }, 0);
              let row = {
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
      {rounds?.length == 0 ? (
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
    </Box>
  );
}
