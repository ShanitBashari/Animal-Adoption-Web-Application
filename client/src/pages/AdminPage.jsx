import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress
} from "@mui/material";

import PetsIcon from "@mui/icons-material/Pets";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate } from "react-router-dom";
import { AdminApi } from "../api/api";
import { useAuth } from "../auth/AuthContext";

function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    totalAnimals: 0,
    pendingAnimals: 0,
    totalUsers: 0
  });

  const isAdmin = (user?.roles || []).includes("ADMIN");

  /**
   * Loads the main admin dashboard statistics from multiple endpoints in parallel.
   */
  useEffect(() => {
    if (!isAdmin) return;

    let mounted = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [animals, requests, users] = await Promise.all([
          AdminApi.animals(),
          AdminApi.requests(),
          AdminApi.users()
        ]);

        const animalsArr = Array.isArray(animals) ? animals : [];
        const requestsArr = Array.isArray(requests) ? requests : [];
        const usersArr = Array.isArray(users) ? users : [];

        const pendingAnimalsCount = animalsArr.filter(
          (a) => String(a.status || "").toUpperCase() === "PENDING"
        ).length;

        if (mounted) {
          setStats({
            totalAnimals: animalsArr.length,
            pendingAnimals: pendingAnimalsCount,
            totalUsers: usersArr.length
          });
        }
      } catch (err) {
        console.error("Failed to load admin dashboard:", err);

        const msg =
          err?.body?.message ||
          err?.body ||
          err?.message ||
          "Failed to load dashboard";

        if (mounted) {
          setError(typeof msg === "string" ? msg : JSON.stringify(msg).slice(0, 200));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <Typography sx={{ textAlign: "center", mt: 10 }}>
        Access Denied
      </Typography>
    );
  }

  /**
   * Card definitions used to render the dashboard statistics section.
   */
  const cards = [
    {
      title: "Total Animals",
      value: stats.totalAnimals,
      icon: <PetsIcon fontSize="large" />,
      color: "#4caf50"
    },
    {
      title: "Pending Animals",
      value: stats.pendingAnimals,
      icon: <PendingActionsIcon fontSize="large" />,
      color: "#ff9800"
    },
    {
      title: "Registered Users",
      value: stats.totalUsers,
      icon: <PeopleIcon fontSize="large" />,
      color: "#2196f3"
    }
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h3"
          sx={{ color: "primary", fontWeight: "bold" }}
        >
          Admin Dashboard
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "primary", opacity: 0.9, mt: 1 }}
        >
          System overview and management
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ textAlign: "center", mt: 4 }}>
          {error}
        </Typography>
      ) : (
        <>
          <Grid container spacing={4} justifyContent="center">
            {cards.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    textAlign: "center",
                    p: 3,
                    borderRadius: 4,
                    transition: "0.3s",
                    cursor: stat.onClick ? "pointer" : "default",
                    "&:hover": {
                      transform: stat.onClick ? "scale(1.05)" : "none"
                    }
                  }}
                  onClick={stat.onClick ? stat.onClick : undefined}
                >
                  <CardContent>
                    <Box sx={{ color: stat.color, mb: 1 }}>
                      {stat.icon}
                    </Box>

                    <Typography variant="h5" sx={{ fontWeight: 900 }}>
                      {stat.value}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ opacity: 0.7, fontWeight: 700 }}
                    >
                      {stat.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

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
              Review Animal Requests
            </Button>

            <Button
              variant="contained"
              color="info"
              onClick={() => navigate("/admin/users")}
            >
              Manage Users
            </Button>

            <Button
              variant="contained"
              color="warning"
              onClick={() => navigate("/admin/categories")}
            >
              Manage Categories
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

export default AdminDashboardPage;