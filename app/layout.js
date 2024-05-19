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

import { createTheme, ThemeProvider } from "@mui/material/styles";

import "./globals.css";

import Link from "next/link";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ListItemIcon } from "@mui/material";
import {
  CredentialsContext,
  _getCredentials,
  _setCredentials,
} from "./utils/auth";

const theme = createTheme({
  // palette: {
  //   primary: {
  //     main: "#ff5733",
  //     light: "#ff5733",
  //     dark: "#ff5733",
  //     contrastText: "#fff",
  //   },
  // },
});

const drawerWidth = 300;
const primaryNavItems = [
  { name: "Results: Detailed", link: "/" },
  { name: "Results: Cumulative", link: "/cumulative" },
  { name: "Results: Constituency", link: "/constituency" },
];
const secondaryNavItems = [{ name: "Login", link: "/login" }];
const primaryNavItemsAdmin = [
  { name: "Results: Detailed", link: "/" },
  { name: "Results: Cumulative", link: "/cumulative" },
  { name: "Results: Constituency", link: "/constituency" },
  { name: "Candidates", link: "/candidates" },
  { name: "Rounds", link: "/rounds" },
];
const primaryNavItemsAuth = [{ name: "Rounds", link: "/rounds" }];
const secondaryNavItemsAuth = [{ name: "Logout", link: "/logout" }];

export default function RootLayout({ children }) {
  const [credentials, __setCredentials] = useState(_getCredentials());
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  // --------------------------------------------------

  const setCredentials = ({ user, password }) => {
    _setCredentials({ user, password });
    __setCredentials({ user, password });
  };

  const clearCredentials = () => {
    _setCredentials({ user: "", password: "" });
    __setCredentials({ user: "", password: "" });
  };

  const getCredentials = () => credentials;

  const hasCredentials = () => credentials.user && credentials.password;

  const hasAdminCredentials = () => credentials.user == "admin";

  // --------------------------------------------------

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
      {(hasAdminCredentials()
        ? primaryNavItemsAdmin
        : hasCredentials()
        ? primaryNavItemsAuth
        : primaryNavItems
      ).map((e) => (
        <Link key={e.link} href={e.link} passHref legacyBehavior>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {{
                  "/candidates": <PersonOutlined />,
                  "/rounds": <ScheduleOutlined />,
                }[e.link] ?? <AssessmentOutlined />}
              </ListItemIcon>
              <ListItemText primary={e.name} />
            </ListItemButton>
          </ListItem>
        </Link>
      ))}
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      {(hasCredentials() ? secondaryNavItemsAuth : secondaryNavItems).map(
        (e) => (
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
        )
      )}
    </Box>
  );

  const container = typeof window == "undefined" ? null : window.document.body;

  return (
    <html>
      <body>
        <ThemeProvider theme={theme}>
          <CredentialsContext.Provider
            value={{
              setCredentials,
              clearCredentials,
              getCredentials,
              hasCredentials,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
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
                      {(hasAdminCredentials()
                        ? primaryNavItemsAdmin
                        : hasCredentials()
                        ? primaryNavItemsAuth
                        : primaryNavItems
                      ).map((e) => (
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
                      {(hasCredentials()
                        ? secondaryNavItemsAuth
                        : secondaryNavItems
                      ).map((e) => (
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
              <Box
                sx={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Toolbar />
                {children}
              </Box>
            </Box>
          </CredentialsContext.Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
