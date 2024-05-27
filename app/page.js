"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  CircularProgress,
  Snackbar,
  Typography,
  Paper,
  backdropClasses,
} from "@mui/material";
import Footer from "./component/Footer/page";
import CandidateImage from "./component/CandidateImage";
import { API_ROUNDS_URL } from "./utils/api";
import Image from "next/image";
import EleCountImg from "../public/croppedElecountImg.jpg";
import Aim from "./component/Aim/Aim";
import FeaturesCard from "./component/Features/Card";
import Features from "./textData/Features.json";
// importing images
import RealTimeImg from "../public/realtime.jpg";
import AutomationImg from "../public/automationVector-min.jpg";
import SafeAndSecureImg from "../public/ss-min.jpg";

import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { FiberPin, WindowSharp } from "@mui/icons-material";

export default function Home() {
  const [sort, setSort] = useState("candidateId");
  const [order, setOrder] = useState("asc");
  const [table, setTable] = useState(null);

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
      <Box maxWidth={700} margin={"auto"}>
        <Image
          src={EleCountImg}
          alt={"EleCount-Image"}
          width={600}
          layout={"responsive"}
        />
      </Box>
      <Box height={50} />

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
                size: 50,
                // backgroundColor: "#d3f9d8",
              },
              {
                width: "auto",
                accessorKey: "candidateName",
                header: "Candidate Name",
                grow: true,
              },
              ...rounds.map((round) => {
                return {
                  width: "auto",
                  accessorKey: `round-${round.roundId}-${round.roundDistrict}-${round.roundConstituency}`,
                  // CHANGED HERE
                  size: 50,
                  header: (
                    <div>
                      {`Round ${round.roundId}`}
                      <br />
                      {`${round.roundDistrict}`}
                      <br />
                      {`${round.roundConstituency}`}
                    </div>
                  ),
                  grow: true,
                };
              }),
              {
                width: "auto",
                accessorKey: "total",
                header: "Total",
                size: 100, // CHANGED HERE
              },
            ];
            const data = [];
            for (let i = 0; i < rounds[0].candidateVoteCounts.length; i++) {
              let row = {
                candidateImage: (
                  <CandidateImage
                    id={rounds[0].candidateVoteCounts[i].candidate.candidateId}
                    width={28}
                    height={28}
                  />
                ),
                candidateName: (
                  <div>
                    {rounds[0].candidateVoteCounts[i].candidate.candidateName}
                    <br />
                    {rounds[0].candidateVoteCounts[i].candidate.candidateParty}
                  </div>
                ),
              };
              for (let j = 0; j < rounds.length; j++) {
                row[
                  `round-${rounds[j].roundId}-${rounds[j].roundDistrict}-${rounds[j].roundConstituency}`
                ] = rounds[j].candidateVoteCounts[i].voteCount;
              }
              row.total = rounds.reduce(
                (acc, round) => acc + round.candidateVoteCounts[i].voteCount,
                0
              );
              data.push(row);
            }

            // console.log(data);
            // console.log(columns);

            return (
              <MaterialReactTable
                enableColumnActions={false}
                muiTableHeadCellProps={{
                  whiteSpace: "nowrap",
                  maxLines: 3,
                }}
                data={data}
                enablePagination={false}
                enableColumnPinning={true}
                // muiTableBodyProps={sx=}
                columns={columns}
                // ------------ SWITCHED OFF AUTO-PINNING ONLY FOR MOBILES
                initialState={{
                  columnPinning:
                    window.innerWidth > 600
                      ? {
                          left: ["candidateImage", "candidateName"],
                          right: ["total"],
                        }
                      : "",
                }}
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

      {/* AIM SECTION */}
      <Aim />
      <Box height={100} />
      {/* FEATURES SECTION */}
      <Box margin="auto">
        <Typography
          sx={{ typography: { xs: "h4", sm: "h3", md: "h2", lg: "h2" } }}
          variant="h2"
          gutterBottom
        >
          Features of EleCount
        </Typography>
      </Box>

      <Box height={50} />

      <Box
        sx={{
          display: "flex",
          margin: "auto",
          flexDirection: { xs: "column", sm: "column", md: "row" },
          justifyContent: "center",
          gap: "10%",
          padding: "2%",
        }}
      >
        <FeaturesCard
          heading={Features.feature1.heading}
          text={Features.feature1.text}
          image={RealTimeImg}
        />
        <FeaturesCard
          heading={Features.feature2.heading}
          text={Features.feature2.text}
          image={AutomationImg}
        />
        <FeaturesCard
          heading={Features.feature3.heading}
          text={Features.feature3.text}
          image={SafeAndSecureImg}
        />
      </Box>

      <Box height={100} />
      {/* FOOTER SECTION */}
      <Footer />
      {/* SNACK BAR */}

      <Snackbar
        open={errorSnackbarOpen}
        autoHideDuration={10000}
        onClose={() => setErrorSnackbarOpen(false)}
        message={"Refresh: Failure"}
      />
    </Box>
  );
}
