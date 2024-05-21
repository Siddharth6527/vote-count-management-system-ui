import React from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import UniLogo from "../../../public/UniversityLogo.jpg";
import Link from "@mui/material";
// import Link from "next/link";

export default function page() {
  return (
    <div>
      <Box
        height={600}
        // maxHeight={600}
        sx={{ backgroundColor: "#36454F", borderRadius: "25px" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            // alignItems: "center",
            // height: "100vh",
            paddingTop: 3,
          }}
        >
          <Image src={UniLogo} alt="university-logo" height={200} />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 4,
          }}
        >
          <Typography variant="h6" color="#EDEADE">
            MADE BY:
          </Typography>
          <Typography
            sx={{ typography: { xs: "h5", sm: "h4", lg: "h2" } }}
            variant="h3"
            color="#FFE5B4"
            paddingLeft={2}
            paddingRight={2}
            align={"center"}
          >
            Department Of Information Technology,{" "}
          </Typography>
          <Typography
            sx={{ typography: { xs: "h6", sm: "h5" } }}
            variant="h4"
            color="#FFE5B4"
            align={"center"}
          >
            College of Technology, GBPUAT Pantnagar
          </Typography>
          <Typography
            sx={{ paddingTop: 2 }}
            variant="subtitle.1"
            color="#FFE5B4"
          >
            Uttarakhand | gbpuat.ac.in
          </Typography>
        </Box>
      </Box>
    </div>
  );
}
