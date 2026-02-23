import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button
} from "@mui/material";

import PetsIcon from "@mui/icons-material/Pets";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PeopleIcon from "@mui/icons-material/People";

import { useNavigate } from "react-router-dom";
import { animals } from "./mockData";

function AdminDashboardPage() {
  const navigate = useNavigate();

  // 🔒 MOCK ADMIN
  const isAdmin = true;

  if (!isAdmin) {
    return (
      <Typography sx={{ textAlign: "center", mt: 10 }}>
        Access Denied
      </Typography>
    );
  }

  // MOCK STATS
  const totalAnimals = animals.length;
  const pendingAnimals = 2;
  const adoptionRequests = 5;
  const totalUsers = 8;

  const stats = [
    {
      title: "Total Animals",
      value: totalAnimals,
      icon: <PetsIcon fontSize="large" />,
      color: "#4caf50"
    },
    {
      title: "Pending Animals",
      value: pendingAnimals,
      icon: <PendingActionsIcon fontSize="large" />,
      color: "#ff9800"
    },
    {
      title: "Adoption Requests",
      value: adoptionRequests,
      icon: <FavoriteIcon fontSize="large" />,
      color: "#f44336"
    },
    {
      title: "Registered Users",
      value: totalUsers,
      icon: <PeopleIcon fontSize="large" />,
      color: "#2196f3"
    }
  ];

  return (
    <Box sx={{ p: 4 }}>
      {/* TITLE */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h3"
          sx={{ color: "#b7edfc", fontWeight: "bold" }}
        >
          Admin Dashboard
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "white", opacity: 0.9, mt: 1 }}
        >
          System overview and management
        </Typography>
      </Box>

      {/* STATS */}
      <Grid container spacing={4} justifyContent="center">
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                textAlign: "center",
                p: 3,
                borderRadius: 4,
                transition: "0.3s",
                "&:hover": {
                  transform: "scale(1.05)"
                }
              }}
            >
              <Box sx={{ color: stat.color, mb: 1 }}>
                {stat.icon}
              </Box>

              <Typography variant="h5">
                {stat.value}
              </Typography>

              <Typography
                variant="body2"
                sx={{ opacity: 0.7 }}
              >
                {stat.title}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ACTIONS */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 3,
          mt: 6,
          flexWrap: "wrap"
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/admin/animals")}
        >
          Manage Animals
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/admin/requests")}
        >
          Manage Requests
        </Button>

        <Button
          variant="contained"
          color="info"
          onClick={() => navigate("/admin/users")}
        >
          Manage Users
        </Button>
      </Box>
    </Box>
  );
}

export default AdminDashboardPage;
