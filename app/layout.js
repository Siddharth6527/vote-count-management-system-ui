"use client";

import { useState } from "react";

import {
  AssessmentOutlined,
  LoginOutlined,
  LogoutOutlined,
  Menu,
  PersonOutlined,
  ScheduleOutlined,
} from "@mui/icons-material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import "./globals.css";

import Link from "next/link";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ListItemIcon } from "@mui/material";

const drawerWidth = 300;
const primaryNavItems = [
  { name: "Results", link: "/" },
  { name: "Candidates", link: "/candidates" },
  { name: "Rounds", link: "/rounds" },
];
const secondaryNavItems = [
  { name: "Login", link: "/login" },
  { name: "Logout", link: "/logout" },
];

export default function RootLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box
      sx={{ height: "100vh", display: "flex", flexDirection: "column" }}
      direction="vertical"
      onClick={handleDrawerToggle}
    >
      <Typography variant="h6" sx={{ my: 4, textAlign: "center" }}>
        Vote Count Management
      </Typography>
      <Divider />
      {primaryNavItems.map((e) => (
        <Link key={e.link} href={e.link} passHref legacyBehavior>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {
                  {
                    "/": <AssessmentOutlined />,
                    "/candidates": <PersonOutlined />,
                    "/rounds": <ScheduleOutlined />,
                  }[e.link]
                }
              </ListItemIcon>
              <ListItemText primary={e.name} />
            </ListItemButton>
          </ListItem>
        </Link>
      ))}
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      {secondaryNavItems.map((e) => (
        <Link key={e.link} href={e.link} passHref legacyBehavior>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {
                  {
                    "/login": <LoginOutlined />,
                    "/logout": <LogoutOutlined />,
                  }[e.link]
                }
              </ListItemIcon>
              <ListItemText sx={{ textDecoration: "" }} primary={e.name} />
            </ListItemButton>
          </ListItem>
        </Link>
      ))}
    </Box>
  );

  const container = window.document.body;

  return (
    <html>
      <body>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100vw",
            height: "100vh",
          }}
        >
          <Box>
            <CssBaseline />
            <AppBar component="nav">
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { md: "none" } }}
                >
                  <Menu />
                </IconButton>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ paddingRight: "56px" }}
                >
                  Vote Count Management
                </Typography>
                <Box sx={{ display: { xs: "none", md: "block" } }}>
                  {primaryNavItems.map((e) => (
                    <Link key={e.link} href={e.link} passHref>
                      <Button
                        startIcon={
                          {
                            "/": <AssessmentOutlined />,
                            "/candidates": <PersonOutlined />,
                            "/rounds": <ScheduleOutlined />,
                          }[e.link]
                        }
                        sx={{ color: "#fff", marginRight: "16px" }}
                      >
                        {e.name}
                      </Button>
                    </Link>
                  ))}
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: { xs: "none", md: "block" } }}>
                  {secondaryNavItems.map((e) => (
                    <Link key={e.link} href={e.link} passHref>
                      <Button
                        startIcon={
                          {
                            "/login": <LoginOutlined />,
                            "/logout": <LogoutOutlined />,
                          }[e.link]
                        }
                        sx={{ color: "#fff", marginRight: "16px" }}
                      >
                        {e.name}
                      </Button>
                    </Link>
                  ))}
                </Box>
              </Toolbar>
            </AppBar>
            <nav>
              <Drawer
                container={container}
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                  display: { xs: "block", md: "none" },
                  "& .MuiDrawer-paper": {
                    boxSizing: "border-box",
                    width: drawerWidth,
                  },
                }}
              >
                {drawer}
              </Drawer>
            </nav>
          </Box>
          <Box sx={{ flex: 1, width: "100%" }}>{children}</Box>
        </Box>
      </body>
    </html>
  );
}
