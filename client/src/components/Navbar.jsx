import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Button,
  Divider,
  Tooltip
} from "@mui/material";

import { alpha, useTheme } from "@mui/material/styles";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import PetsIcon from "@mui/icons-material/Pets";
import MailIcon from "@mui/icons-material/Mail";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import { useColorMode } from "../theme/ColorModeContext";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";

function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { mode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth();

  const isLoggedIn = !!user?.accessToken;
  const isAdmin = (user?.roles || []).includes("ADMIN");

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, path: "/" },

    ...(isLoggedIn
      ? [
          { text: "My Animals", icon: <PetsIcon />, path: "/my-animals" },
          { text: "My Adoption Requests", icon: <MailIcon />, path: "/my-requests" },
          {
            text: "Requests on My Listings",
            icon: <DashboardIcon />,
            path: "/my-listing-requests"
          }
        ]
      : []),

    ...(isAdmin
      ? [
          {
            text: "Admin Dashboard",
            icon: <AdminPanelSettingsIcon />,
            path: "/admin"
          }
        ]
      : [])
  ];

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully 👋", {
      position: "bottom-right",
      autoClose: 2500
    });
    setOpen(false);
    navigate("/login", { replace: true });
  };

  const drawerBg = theme.palette.background.paper;
  const drawerText = theme.palette.text.primary;
  const iconColor = theme.palette.primary.main;

  const hoverBg = alpha(theme.palette.primary.main, isDark ? 0.18 : 0.10);

  const outlinedBtnSx = {
    mr: 2,
    fontWeight: 700,
    borderColor: alpha(theme.palette.text.primary, 0.25),
    "&:hover": { borderColor: alpha(theme.palette.text.primary, 0.45) }
  };

  return (
    <>
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Toolbar sx={{ display: "flex", alignItems: "center" }}>
          <IconButton edge="start" color="inherit" onClick={() => setOpen(true)}>
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            sx={{ ml: 2, fontWeight: 800, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Pet Adoption 🐾
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            variant="outlined"
            color="inherit"
            startIcon={<HomeIcon />}
            onClick={() => navigate("/")}
            sx={outlinedBtnSx}
          >
            Home
          </Button>

          {isLoggedIn && (
            <>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<MailIcon />}
                onClick={() => navigate("/my-requests")}
                sx={outlinedBtnSx}
              >
                My Requests
              </Button>

              <Button
                variant="outlined"
                color="inherit"
                startIcon={<PetsIcon />}
                onClick={() => navigate("/my-listing-requests")}
                sx={outlinedBtnSx}
              >
                My Animals Requests
              </Button>
            </>
          )}

          {isAdmin && (
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<DashboardIcon />}
              onClick={() => navigate("/admin")}
              sx={outlinedBtnSx}
            >
              Dashboard
            </Button>
          )}

          <Tooltip title={mode === "dark" ? "Light mode" : "Dark mode"}>
            <IconButton color="inherit" onClick={toggleColorMode} sx={{ mr: 1 }}>
              {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          {isLoggedIn && (
            <Button
              variant="contained"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ fontWeight: 800 }}
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: drawerBg,
            color: drawerText,
            width: 300,
            borderRight: `1px solid ${theme.palette.divider}`
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 900 }}>
            Navigation
          </Typography>

          {!isLoggedIn && (
            <>
              <List>
                <ListItem
                  button
                  onClick={() => handleNavigate("/login")}
                  sx={{ borderRadius: 2, "&:hover": { bgcolor: hoverBg } }}
                >
                  <ListItemIcon sx={{ color: iconColor }}>
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText primary="Login" />
                </ListItem>

                <ListItem
                  button
                  onClick={() => handleNavigate("/register")}
                  sx={{ borderRadius: 2, "&:hover": { bgcolor: hoverBg } }}
                >
                  <ListItemIcon sx={{ color: iconColor }}>
                    <HowToRegIcon />
                  </ListItemIcon>
                  <ListItemText primary="Register" />
                </ListItem>
              </List>

              <Divider sx={{ my: 2 }} />
            </>
          )}

          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => handleNavigate(item.path)}
                sx={{ borderRadius: 2, "&:hover": { bgcolor: hoverBg } }}
              >
                <ListItemIcon sx={{ color: iconColor }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>

          {isLoggedIn && (
            <>
              <Divider sx={{ my: 2 }} />
              <List>
                <ListItem
                  button
                  onClick={handleLogout}
                  sx={{
                    borderRadius: 2,
                    "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.12) }
                  }}
                >
                  <ListItemIcon sx={{ color: theme.palette.error.main }}>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItem>
              </List>
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
}

export default Navbar;
