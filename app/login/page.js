"use client";

import { Lock, Person } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment,
  LinearProgress,
  Snackbar,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { API_CANDIDATES_URL } from "../utils/api";
import { SetCredentialsContext } from "../utils/auth";

export default function Login() {
  const router = useRouter();
  const { setCredentials, hasCredentials } = useContext(SetCredentialsContext);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(null);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarMessage(null);
  };

  useEffect(() => {
    if (hasCredentials()) {
      router.replace("/");
    }
  }, []);

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Box
      sx={{
        px: 2,
        flex: 1,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card elevation="2" sx={{ maxWidth: 400, width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          <Container
            style={{
              height: 256,
              background: "#545454",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Person sx={{ fontSize: "96px" }} htmlColor="#FFFFFF" />
          </Container>
          <Box
            sx={{
              transitionDuration: "0.3s",
              opacity: loading ? 1.0 : 0.0,
            }}
          >
            <LinearProgress />
          </Box>
          <Box
            sx={{
              transitionDuration: "0.3s",
              pointerEvents: loading ? "none" : "auto",
              opacity: loading ? 0.5 : 1.0,
              p: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "stretch",
            }}
          >
            <Box sx={{ height: 32 }} />
            <TextField
              onChange={(e) => setUser(e.target.value.trim())}
              variant="filled"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
              type="text"
              label="User"
              placeholder="User"
            />
            <Box sx={{ height: 16 }} />
            <TextField
              onChange={(e) => setPassword(e.target.value.trim())}
              variant="filled"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
              type="password"
              label="Password"
              placeholder="Password"
            />
            <Box sx={{ height: 32 }} />
            <Button
              onClick={async () => {
                if (user == "") {
                  setSnackbarMessage("Missing: User");
                  return;
                }
                if (password == "") {
                  setSnackbarMessage("Missing: Password");
                  return;
                }
                setLoading(true);
                try {
                  const response = await fetch(API_CANDIDATES_URL, {
                    cache: "no-cache",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: "Basic " + btoa(user + ":" + password),
                    },
                  });
                  if (response.status === 200) {
                    router.replace("/");
                    setCredentials({ user, password });
                  } else if (response.status == 401) {
                    setSnackbarMessage("Unauthorized");
                  }
                } catch (e) {
                  setSnackbarMessage("Failure");
                }
                setLoading(false);
              }}
              variant="contained"
            >
              Login
            </Button>
            <Box sx={{ height: 32 }} />
          </Box>
        </Box>
      </Card>
      <Snackbar
        open={snackbarMessage != null}
        autoHideDuration={10000}
        onClose={handleClose}
        message={snackbarMessage}
        action={action}
      />
    </Box>
  );
}
