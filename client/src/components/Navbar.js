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
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import PetsIcon from "@mui/icons-material/Pets";
import AddIcon from "@mui/icons-material/Add";
import MailIcon from "@mui/icons-material/Mail";

function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
    
const user = { role: "admin" };

const menuItems = [
  { text: "Home", icon: <HomeIcon />, path: "/" },
  { text: "My Animals", icon: <PetsIcon />, path: "/my-animals" },
  { text: "Add Animal", icon: <AddIcon />, path: "/add-animal" },
  { text: "Adoption Requests", icon: <MailIcon />, path: "/requests" },

  ...(user.role === "admin"
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

  return (
    <>
      {/* 🔝 Top AppBar */}
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ ml: 2 }}>
            Pet Adoption
          </Typography>
        </Toolbar>
      </AppBar>

      {/* 🍔 Drawer */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: "#1e1e2a",
            color: "white",
            width: 260
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: "bold" }}
          >
            Navigation
          </Typography>

          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  borderRadius: 2,
                  "&:hover": {
                    bgcolor: "rgba(183, 237, 252, 0.15)"
                  }
                }}
              >
                <ListItemIcon sx={{ color: "#b7edfc" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

    </>
  );
}

export default Navbar;
