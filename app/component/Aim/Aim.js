import React from "react";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { Grid } from "@mui/material";
import mainImg from "../../../public/main.jpg";
import Image from "next/image";

export default function Aim() {
  return (
    <div>
      <Box height={100} />
      <Box>
        <Image src={mainImg} alt={"main-image"}></Image>
      </Box>
      <Box sx={{ padding: "2%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h2" color="initial">
            EleCount&apos;s Aim
          </Typography>
        </Box>
        <Box height={50} />
        <Box>
          <Grid
            sx={{ display: "flex", justifyContent: "center" }}
            container
            spacing={2}
          >
            <Grid item xs={6}>
              <Typography variant="h5" color="initial">
                The main aim of EleCount is to deliver real-time Electoral
                Counting updates to everyone who aspires to be in-touch with the
                Election results. Huge emphases is laid on the application to
                ensure that the data is correct and reliable. It shortens the
                gap between Election Officials and the public, spreading the
                information in no time.
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box height={100} />
      </Box>
    </div>
  );
}
