"use client";

import { Delete, Refresh } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  SwipeableDrawer,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import AddCandidateSwipeableDrawerContent from "../component/AddCandidateSwipeableDrawerContent";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import CandidateImage from "../component/CandidateImage";
import { API_CANDIDATES_URL, API_CANDIDATE_DELETE_URL } from "../utils/api";
import { CredentialsContext } from "../utils/auth";

export default function Candidates() {
  const router = useRouter();
  const [deleteDialogCandidate, setDeleteDialogCandidate] = useState(null);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [
    addNewCandidateSwipableDrawerOpen,
    setAddNewCandidateSwipableDrawerOpen,
  ] = useState(false);
  const [candidates, setCandidates] = useState(null);
  const [loading, setLoading] = useState(false);
  const { hasCredentials, getCredentials } = useContext(CredentialsContext);

  const fetchCandidates = async () => {
    if (loading) {
      return;
    }
    setLoading(true);

    console.log("Fetching candidates...");

    try {
      const response = await fetch(API_CANDIDATES_URL, {
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
        setCandidates(data);
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

  const deleteCandidate = async (candidateId) => {
    if (loading) {
      return;
    }
    setLoading(true);

    console.log("Deleting candidate...");

    try {
      await fetch(API_CANDIDATE_DELETE_URL + candidateId, {
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
    fetchCandidates();
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
      <Button
        variant="contained"
        onClick={() => setAddNewCandidateSwipableDrawerOpen(true)}
      >
        Add New Candidate
      </Button>
      <br />
      <Box
        sx={{
          width: "100%",
          // overflowX: "scroll",
        }}
      >
        <Alert
          sx={{
            whiteSpace: "nowrap",
            overflow: "inherit",
          }}
          severity="warning"
        >
          Newly added candidates will have zero votes in existing rounds.
        </Alert>
      </Box>

      <br />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="div">
          Candidates
        </Typography>
        <Box sx={{ width: 16 }} />
        <IconButton onClick={fetchCandidates}>
          <Refresh />
        </IconButton>
      </Box>
      <br />

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
      {candidates != null && !loading ? (
        <TableContainer elevation={2} component={Paper}>
          <Table
            sx={{ minWidth: 800, whiteSpace: "nowrap" }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell align="center" size="small">
                  S. No.
                </TableCell>
                <TableCell align="center">Candidate Image</TableCell>
                <TableCell>Candidate Name</TableCell>
                <TableCell>Candidate Party</TableCell>
                <TableCell>Candidate Address</TableCell>
                <TableCell align="center" size="small">
                  &nbsp;
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(() => {
                try {
                  return candidates.map((candidate, i) => {
                    return (
                      <TableRow
                        key={candidate.candidateId}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="center" size="small">
                          {i + 1}
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              height: "36px",
                            }}
                          >
                            <CandidateImage
                              id={candidate.candidateId}
                              height={36}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>{candidate.candidateName}</TableCell>
                        <TableCell>{candidate.candidateParty}</TableCell>
                        <TableCell>{candidate.candidateAddress}</TableCell>
                        <TableCell align="center" size="small">
                          <IconButton
                            onClick={() => {
                              setDeleteDialogCandidate(candidate);
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  });
                } catch (e) {
                  return null;
                }
              })()}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
      {candidates?.length == 0 && !loading ? (
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
            No candidates found.
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
        open={deleteDialogCandidate != null}
        onClose={() => setDeleteDialogCandidate(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete ?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Candidate with following details will be deleted:
            <br />
            <b>Name:</b> {deleteDialogCandidate?.candidateName}
            <br />
            <b>Party:</b> {deleteDialogCandidate?.candidateParty}
            <br />
            <b>Address:</b> {deleteDialogCandidate?.candidateAddress}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={async () => {
              const candidateId = deleteDialogCandidate.candidateId;
              setDeleteDialogCandidate(null);
              await deleteCandidate(candidateId);
              await fetchCandidates();
            }}
          >
            Yes
          </Button>
          <Button
            onClick={async () => {
              setDeleteDialogCandidate(null);
            }}
            autoFocus
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
      <SwipeableDrawer
        anchor={"bottom"}
        open={addNewCandidateSwipableDrawerOpen}
        onClose={() => setAddNewCandidateSwipableDrawerOpen(false)}
      >
        <AddCandidateSwipeableDrawerContent
          key={addNewCandidateSwipableDrawerOpen}
          close={() => {
            setAddNewCandidateSwipableDrawerOpen(false);
            fetchCandidates();
          }}
        />
      </SwipeableDrawer>
    </Box>
  );
}
