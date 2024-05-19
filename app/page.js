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
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import Tables from "./component/Tables/Tables";
import { Grid } from "@mui/material";
import Image from "next/image";
import ActionAreaCard from "./component/Features/Card";
import CandidateImage from "./component/CandidateImage";
import { API_ROUNDS_URL } from "./utils/api";

import Aim from "./component/Aim/Aim";
import Footer from "./component/Footer/Footer";

// FOR ADDING IMAGES
import img1 from "../public/test2.jpg";
import img3 from "../public/automationVector.jpg";
import img4 from "../public/ss.jpg";
import EleCountImg from "../public/EleCountEdited.jpg";

export default function Home() {
  // for custom text -- GONNA REFINE AFTERWARDS
  const text1 =
    "Real-time updates deliver instant information, keeping users informed without delay. They enhance engagement and decision-making by ensuring access to the latest data across platforms.";

  const text2 =
    "Automated application software performs tasks with minimal human intervention using pre-defined rules and algorithms, enhancing efficiency and reducing errors. It revolutionizes productivity, transforming both everyday tasks and complex operations across diverse industries.";

  const text3 =
    "Safe software operates without causing unintended harm or adverse effects, ensuring user safety and system stability. Secure software protects against unauthorized access and malicious attacks, maintaining confidentiality, integrity, and availability of data.";

  ///////////////////////////////////////////////////////

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

  // LOGIC FOR AUTO-REFRESHING
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
      {/* ELECOUNT IMAGE */}
      <Box
        sx={{
          margin: "auto",
        }}
      >
        {/* default height was 800 */}
        <Image
          src={EleCountImg}
          alt={"elecount-img"}
          layout="responsive"
          // sx={{ height: { sm: 200, md: 300, lg: 400, xl: 800 } }}
          // width={"50%"}
          height={600}
          // height={{ md: 800, lg: 600 }}
        />
      </Box>

      {/* FOR TESTING PINNING COLUMNS */}
      <Tables />
      <Box height={50}></Box>

      {/* TESTING ENDS HERE */}

      <Box sx={{ display: "flex", flexDirection: "row" }}>
        {/* FOR SORTING BUTTON */}
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
        {/* FOR ORDERING BUTTON */}
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
      {/* LOADING ANIMATION */}
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
          {/* COLUMNS HEADINGS */}
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell size="small" align="center">
                  {/* &nbsp; */}
                  Initials
                </TableCell>
                <TableCell align="center">
                  {/* &nbsp; */}
                  Candidate Name
                </TableCell>
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

            {/* TABLE CONTENT SECTION */}
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

      {/* NO ROUNDS FOUND SECTION */}
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

      {/* AIM SECTION */}
      <Aim />
      {/* AIM SECTION ENDS */}

      <Box height={100}></Box>

      {/* FEATURES SECTION */}
      {/* FOR FEATURES HEADING SECTION */}

      <Grid
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        container
        spacing={2}
      >
        <Grid item xs={6}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h2" gutterBottom>
              Features of EleCount
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Box height={50}></Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: "10%",
          padding: "2%",
        }}
      >
        <ActionAreaCard heading="Real Time Data" text={text1} image={img1} />
        <ActionAreaCard
          heading="Automated Application"
          text={text2}
          image={img3}
        />
        <ActionAreaCard heading="Safe and Secure" text={text3} image={img4} />
      </Box>
      {/* FEATURES SECTION ENDS */}

      {/* FOOTER SECTION */}
      <Footer></Footer>
      {/* FOOTER SECTION ENDS*/}

      <Snackbar
        open={errorSnackbarOpen}
        autoHideDuration={10000}
        onClose={() => setErrorSnackbarOpen(false)}
        message={"Refresh: Failure"}
      />
    </Box>
  );
}
