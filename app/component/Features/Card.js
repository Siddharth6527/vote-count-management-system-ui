import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Image from "next/image";

export default function ActionAreaCard(props) {
  return (
    // default maxwidth 345
    <Card sx={{ Width: 300 }}>
      <CardActionArea>
        <Image src={props.image} alt="testing" width={400}></Image>
        {/* height = 140 */}
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <Typography gutterBottom variant="h5" component="div">
            {props.heading}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.text}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
