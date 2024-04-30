"use client";

import React from "react";
import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { CredentialsContext } from "../utils/auth";
import { API_ROUNDS_URL, API_ROUNDS_DELETE_URL } from "../utils/api";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  Card,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Snackbar,
  Chip,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Refresh, Delete } from "@mui/icons-material";
import CandidateImage from "../component/CandidateImage";

export default function Rounds() {
  const router = useRouter();
  const [deleteDialogRound, setDeleteDialogRound] = useState(null);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [addNewRoundSwipableDrawerOpen, setAddNewRoundSwipableDrawerOpen] =
    useState(false);
  const [rounds, setRounds] = useState(null);
  const [loading, setLoading] = useState(false);
  const { hasCredentials, getCredentials } = useContext(CredentialsContext);

  const fetchRounds = async () => {
    if (loading) {
      return;
    }
    setLoading(true);

    console.log("Fetching rounds...");

    try {
      const response = await fetch(API_ROUNDS_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            btoa(getCredentials().user + ":" + getCredentials().password),
        },
      });
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
    setLoading(false);
  };

  const deleteRound = async (roundId, roundDistrict) => {
    if (loading) {
      return;
    }
    setLoading(true);

    console.log("Deleting round...");

    try {
      await fetch(API_ROUNDS_DELETE_URL + roundId + "/" + roundDistrict, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            btoa(getCredentials().user + ":" + getCredentials().password),
        },
      });
    } catch (e) {
      console.log(e);
      setErrorSnackbarOpen(true);
      setTimeout(() => setErrorSnackbarOpen(false), 10000);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!hasCredentials()) {
      router.replace("/");
      return;
    }
    fetchRounds();
  }, []);

  return (
    <Box
      sx={{
        p: 2,
        flex: 1,
        overflowX: "scroll",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      <Box sx={{ height: 8 }} />
      <Button
        variant="contained"
        onClick={() => setAddNewRoundSwipableDrawerOpen(true)}
      >
        Add New Round
      </Button>
      <Box sx={{ height: 32 }} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="div">
          Rounds
        </Typography>
        <Box sx={{ width: 16 }} />
        <IconButton onClick={fetchRounds}>
          <Refresh />
        </IconButton>
      </Box>
      <Box sx={{ height: 32 }} />
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
                  <TableCell size="small">&nbsp;</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(() => {
                  try {
                    return rounds.map((round, i) => {
                      return (
                        <React.Fragment>
                          <TableRow
                            key={`${round.roundId}-${round.roundDistrict}`}
                            sx={{
                              "*": { borderBottom: "unset" },
                            }}
                          >
                            <TableCell size="small">{round.roundId}</TableCell>
                            <TableCell>{round.roundDistrict}</TableCell>
                            <TableCell size="small">
                              <IconButton
                                onClick={() => {
                                  setDeleteDialogRound(round);
                                }}
                              >
                                <Delete />
                              </IconButton>
                            </TableCell>
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
      <Dialog
        open={deleteDialogRound != null}
        onClose={() => setDeleteDialogRound(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete ?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Round with following details will be deleted:
            <br />
            <b>Round Number:</b> {deleteDialogRound?.roundId}
            <br />
            <b>Round District</b> {deleteDialogRound?.roundDistrict}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={async () => {
              const roundId = deleteDialogRound?.roundId;
              const roundDistrict = deleteDialogRound?.roundDistrict;
              setDeleteDialogRound(null);
              await deleteRound(roundId, roundDistrict);
              await fetchRounds();
            }}
          >
            Yes
          </Button>
          <Button
            onClick={async () => {
              setDeleteDialogRound(null);
            }}
            autoFocus
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
