import { useState, useContext } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  LinearProgress,
} from "@mui/material";
import { CredentialsContext } from "../utils/auth";
import { API_CANDIDATE_SAVE_URL } from "../utils/api";

export default function AddCandidateSwipeableDrawerContent({ close }) {
  const [loading, setLoading] = useState(false);
  const { getCredentials } = useContext(CredentialsContext);

  const [candidateName, setCandidateName] = useState("");
  const [candidateParty, setCandidateParty] = useState("");
  const [candidateAddress, setCandidateAddress] = useState("");
  const [candidateImage, setCandidateImage] = useState(null);

  const [nameError, setNameError] = useState(false);
  const [partyError, setPartyError] = useState(false);
  const [addressError, setAddressError] = useState(false);

  const saveCandidate = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      console.log({
        candidateName: candidateName,
        candidateParty: candidateParty,
        candidateAddress: candidateAddress,
        candidateImage:
          typeof candidateImage === "string" ? candidateImage : null,
      });
      const response = await fetch(API_CANDIDATE_SAVE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            btoa(getCredentials().user + ":" + getCredentials().password),
        },
        body: JSON.stringify({
          candidateName: candidateName,
          candidateParty: candidateParty,
          candidateAddress: candidateAddress,
          candidateImage:
            typeof candidateImage === "string" ? candidateImage : null,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (response.status == 200) {
        if (data.success == true) {
          close();
          return;
        }
      }
      throw new Error();
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <>
      <LinearProgress sx={{ opacity: loading ? 1.0 : 0.0 }} />
      <Box
        sx={{
          opacity: loading ? 0.5 : 1.0,
          pointerEvents: loading ? "none" : "auto",
          p: 4,
          flex: 1,
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "stretch",
        }}
      >
        <Typography sx={{ maxWidth: "100%" }} variant="h6" component="div">
          Candidate Details
        </Typography>
        <Box sx={{ height: 16 }} />
        <TextField
          onChange={(e) => setCandidateName(e.target.value)}
          error={nameError}
          sx={{ maxWidth: "100%" }}
          variant="outlined"
          label="Candidate Name"
          placeholder="Candidate Name"
        />
        <Box sx={{ height: 16 }} />
        <TextField
          onChange={(e) => setCandidateParty(e.target.value)}
          error={partyError}
          sx={{ maxWidth: "100%" }}
          variant="outlined"
          label="Candidate Party"
          placeholder="Candidate Party"
        />
        <Box sx={{ height: 16 }} />
        <TextField
          onChange={(e) => setCandidateAddress(e.target.value)}
          error={addressError}
          sx={{ maxWidth: "100%" }}
          variant="outlined"
          label="Candidate Address"
          placeholder="Candidate Address"
        />
        <Box sx={{ height: 16 }} />
        <Typography variant="subtitle1" component="div">
          Candidate Image (Optional)
        </Typography>
        <Box sx={{ height: 16 }} />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            fileReader.onload = () => {
              console.log(fileReader.result);
              setCandidateImage(fileReader.result);
            };
          }}
        />
        <Box sx={{ height: 32 }} />
        <Button
          sx={{ maxWidth: "100%" }}
          variant="contained"
          onClick={() => {
            setNameError(false);
            setPartyError(false);
            setAddressError(false);
            if (!candidateName) {
              setNameError(true);
              return;
            }
            if (!candidateParty) {
              setPartyError(true);
              return;
            }
            if (!candidateAddress) {
              setAddressError(true);
              return;
            }
            saveCandidate();
          }}
        >
          Add
        </Button>
      </Box>
    </>
  );
}
