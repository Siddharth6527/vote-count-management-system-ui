import * as React from "react";
import { useState, useContext } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { FormControl, LinearProgress, InputAdornment } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import { API_ROUNDS_SAVE_URL } from "../utils/api";
import MenuItem from "@mui/material/MenuItem";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { CredentialsContext } from "../utils/auth";
import { Box } from "@mui/material";
import CandidateImage from "./CandidateImage";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddRoundDialog({ open, onClose, candidates }) {
  const [loading, setLoading] = useState(false);
  const { getCredentials } = useContext(CredentialsContext);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

  const [roundId, setRoundNumber] = useState(null);
  const [roundDistrict, setRoundDistrict] = useState("Nainital");

  const [candidateVotes, setCandidateVotes] = useState({});

  const [roundIdError, setRoundNumberError] = useState(false);
  const [roundDistrictError, setRoundDistrictError] = useState(false);
  const [candidateVoteErrors, setCandidateVoteErrors] = useState({});

  const addRound = async () => {
    if (loading) {
      return;
    }
    console.log({
      roundId: roundId,
      roundDistrict: roundDistrict,
      candidateVotes: candidateVotes,
    });
    setRoundNumberError(false);
    setRoundDistrictError(false);
    setCandidateVoteErrors({});
    if (roundId == null) {
      setRoundNumberError(true);
      return;
    }
    if (roundDistrict == null) {
      setRoundDistrictError(true);
      return;
    }
    for (const candidate of candidates) {
      if (typeof candidateVotes[candidate.candidateId] !== "number") {
        setCandidateVoteErrors({
          [candidate.candidateId]: true,
        });
        return;
      }
    }
    setLoading(true);
    try {
      console.log({
        roundId: roundId,
        roundDistrict: roundDistrict,
        candidateVotes: candidateVotes,
      });
      const response = await fetch(API_ROUNDS_SAVE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            btoa(getCredentials().user + ":" + getCredentials().password),
        },
        body: JSON.stringify({
          roundId: roundId,
          roundDistrict: roundDistrict,
          candidateVotes: candidateVotes,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (response.status == 200) {
        if (data.success == true) {
          onClose();
          return;
        }
      }
      throw new Error();
    } catch (e) {
      console.error(e);
      setErrorSnackbarOpen(true);
      setTimeout(() => setErrorSnackbarOpen(false), 10000);
    }
    setLoading(false);
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Round Details
          </Typography>
        </Toolbar>
      </AppBar>
      <LinearProgress sx={{ opacity: loading ? 1.0 : 0.0 }} />
      <Box
        sx={{
          p: 2,
          pointerEvents: loading ? "none" : "auto",
          flex: 1,
          opacity: loading ? 0.5 : 1.0,
          overflowY: "scroll",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "stretch",
        }}
      >
        <Box sx={{ height: 20 }} />
        <TextField
          onChange={(e) => {
            if (e.target.value == "") {
              setRoundNumber(null);
              return;
            } else {
              setRoundNumber(Number(e.target.value));
            }
          }}
          error={roundIdError}
          sx={{ maxWidth: "100%" }}
          variant="outlined"
          label="Round Number"
          onInput={(e) => {
            e.target.value = Math.max(0, parseInt(e.target.value)).toString();
          }}
          type="number"
        />
        <Box sx={{ height: 16 }} />
        <FormControl>
          <InputLabel id="round-district-label">Round District</InputLabel>
          <Select
            id="round-district-select"
            labelId="round-district-label"
            value={roundDistrict}
            variant="outlined"
            label="Round District"
            onChange={(e) => setRoundDistrict(e.target.value)}
            error={roundDistrictError}
          >
            <MenuItem value={"Nainital"}>Nainital</MenuItem>
            <MenuItem value={"Udham Singh Nagar"}>Udham Singh Nagar</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ height: 16 }} />
        <Typography variant="body1" component="div">
          Candidate votes
        </Typography>
        <Box sx={{ height: 16 }} />
        {candidates != undefined &&
          candidates.length > 0 &&
          candidates.map((candidate) => {
            return (
              <React.Fragment>
                <TextField
                  sx={{ maxWidth: "100%" }}
                  variant="outlined"
                  label={`${candidate.candidateName} (${candidate.candidateParty})`}
                  key={candidate.candidateId}
                  onChange={(e) => {
                    if (e.target.value == "") {
                      setCandidateVotes({
                        ...candidateVotes,
                        [candidate.candidateId]: null,
                      });
                      return;
                    } else {
                      setCandidateVotes({
                        ...candidateVotes,
                        [candidate.candidateId]: Number(e.target.value),
                      });
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CandidateImage
                          height={20}
                          width={20}
                          id={candidate.candidateId}
                        />
                      </InputAdornment>
                    ),
                  }}
                  error={candidateVoteErrors[candidate.candidateId]}
                  onInput={(e) => {
                    e.target.value = Math.max(
                      0,
                      parseInt(e.target.value)
                    ).toString();
                  }}
                  type="number"
                />
                <Box sx={{ height: 16 }} />
              </React.Fragment>
            );
          })}
        <Box sx={{ height: 16 }} />
        <Button onClick={addRound} variant="contained">
          Add
        </Button>
      </Box>
      <Snackbar
        open={errorSnackbarOpen}
        autoHideDuration={10000}
        onClose={() => setErrorSnackbarOpen(false)}
        message={"Failure!"}
      />
    </Dialog>
  );
}