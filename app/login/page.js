"use client";

import { Lock, Person } from "@mui/icons-material";
import { Box, Button, Card, InputAdornment, TextField } from "@mui/material";
import { Container } from "react-bootstrap";

export default function Login() {
  return (
    <Box
      sx={{
        px: 2,
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
              p: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "stretch",
            }}
          >
            {" "}
            <Box sx={{ height: 32 }} />
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
              type="text"
              placeholder="User"
            />
            <Box sx={{ height: 16 }} />
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
              type="password"
              placeholder="Password"
            />
            <Box sx={{ height: 32 }} />
            <Button variant="contained">Login</Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
