import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Chip,
  Container,
  CircularProgress,
  Card,
  CardContent,
  CardMedia
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import PetsIcon from "@mui/icons-material/Pets";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useNavigate } from "react-router-dom";

import { RequestsApi } from "../api/api";
import { useAuth } from "../auth/AuthContext";
import ConfirmDialog from "../components/ConfirmDialog";
import AnimalDetailsDialog from "../components/AnimalDetailsDialog";
import AnimalDetailsContent from "../components/AnimalDetailsContent";

function MyAdoptionRequestsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState("");

  const [openCancel, setOpenCancel] = useState(false);
  const [pendingCancel, setPendingCancel] = useState(null);

  const [openDetails, setOpenDetails] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  /**
   * Loads the current user's adoption requests.
   * Redirects to login if the user is not authenticated.
   */
  useEffect(() => {
    if (!user?.accessToken) {
      navigate("/login");
      return;
    }

    let mounted = true;

    async function loadRequests() {
      try {
        setLoading(true);
        setError("");

        const data = await RequestsApi.mine();

        if (mounted) {
          setMyRequests(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load requests:", err);

        const msg =
          err?.body?.message ||
          err?.body ||
          err?.message ||
          "Failed to load adoption requests";

        if (mounted) {
          setError(typeof msg === "string" ? msg : JSON.stringify(msg).slice(0, 200));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadRequests();

    return () => {
      mounted = false;
    };
  }, [user?.accessToken, navigate]);

  /**
   * Cancels a pending adoption request and updates only that request locally.
   */
  async function handleCancelConfirmed() {
    if (!pendingCancel?.id) return;

    try {
      setCancelLoading(true);
      await RequestsApi.cancel(pendingCancel.id);

      setMyRequests((prev) =>
        prev.map((req) =>
          req.id === pendingCancel.id ? { ...req, status: "CANCELED" } : req
        )
      );

      setOpenCancel(false);
      setPendingCancel(null);
    } catch (err) {
      console.error("Cancel failed:", err);

      const msg =
        err?.body?.message ||
        err?.body ||
        err?.message ||
        "Cancel failed";

      alert(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setCancelLoading(false);
    }
  }

  /**
   * Maps request status to a user-friendly label, chip color and icon.
   */
  function getStatusConfig(status) {
    switch (status) {
      case "APPROVED":
        return {
          label: "Approved",
          color: "success",
          icon: <CheckCircleIcon sx={{ fontSize: 16 }} />
        };
      case "REJECTED":
        return {
          label: "Rejected",
          color: "error",
          icon: <CancelIcon sx={{ fontSize: 16 }} />
        };
      case "CANCELED":
        return {
          label: "Canceled",
          color: "default",
          icon: <InfoOutlinedIcon sx={{ fontSize: 16 }} />
        };
      case "PENDING":
      default:
        return {
          label: "Pending",
          color: "warning",
          icon: <HourglassTopIcon sx={{ fontSize: 16 }} />
        };
    }
  }

  /**
   * Rebuilds an animal-like object from request fields
   * so it can be displayed by the shared animal details dialog.
   */
  function buildAnimalFromRequest(req) {
    return {
      id: req.animalId,
      name: req.animalName,
      image: req.animalImage,
      location: req.animalLocation,
      category: req.animalCategory,
      gender: req.animalGender,
      age: req.animalAge,
      size: req.animalSize,
      ownerName: req.animalOwnerName,
      ownerPhone: req.animalOwnerPhone,
      description: req.animalDescription,
      status: req.animalStatus
    };
  }

  /**
   * Resolves animal image from base64, full URL or backend relative path.
   */
  function resolveImageSrc(raw) {
    const API_BASE = process.env.REACT_APP_API_URL;

    if (!raw || String(raw).trim() === "") {
      return "/placeholder-animal.png";
    }

    if (raw.startsWith("data:") || raw.startsWith("http")) {
      return raw;
    }

    return `${API_BASE}${raw.startsWith("/") ? "" : "/"}${raw}`;
  }

  return (
    <>
      <Box
        onClick={() => navigate("/")}
        sx={(theme) => {
          const isDark = theme.palette.mode === "dark";
          const accent = isDark ? theme.palette.primary.light : theme.palette.primary.main;

          return {
            position: "fixed",
            top: 90,
            left: 24,
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            color: accent,
            fontWeight: 800,
            opacity: 0.92,
            transition: "0.2s",
            zIndex: 10,
            px: 1.2,
            py: 0.7,
            borderRadius: 999,
            bgcolor: alpha(accent, isDark ? 0.08 : 0.06),
            border: `1px solid ${alpha(accent, isDark ? 0.22 : 0.18)}`,
            backdropFilter: "blur(8px)",
            "&:hover": {
              opacity: 1,
              transform: "translateX(-4px)",
              bgcolor: alpha(accent, isDark ? 0.14 : 0.1)
            }
          };
        }}
      >
        <ArrowBackIcon fontSize="small" />
        <Typography variant="body2" sx={{ fontWeight: 800 }}>
          Back to Home
        </Typography>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Box sx={{ textAlign: "center", mb: 4, px: 2 }}>
          <Typography
            variant="h3"
            sx={(theme) => {
              const isDark = theme.palette.mode === "dark";
              const accent = isDark ? theme.palette.primary.light : theme.palette.primary.main;

              return {
                textAlign: "center",
                mb: 1,
                fontWeight: 900,
                letterSpacing: "0.4px",
                color: "transparent",
                background: isDark
                  ? "linear-gradient(90deg,#b7edfc,#7dd3fc)"
                  : `linear-gradient(90deg,${theme.palette.primary.dark},${accent})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-flex",
                alignItems: "center",
                gap: 1
              };
            }}
          >
            My Adoption Requests <PetsIcon />
          </Typography>

          <Typography
            variant="body1"
            sx={(theme) => ({
              textAlign: "center",
              mb: 1,
              fontWeight: 800,
              color: alpha(theme.palette.text.primary, theme.palette.mode === "dark" ? 0.86 : 0.78)
            })}
          >
            Track the adoption requests you’ve submitted and see their current status.
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ textAlign: "center", mt: 4, fontWeight: 800 }}>
            {error}
          </Typography>
        ) : myRequests.length === 0 ? (
          <Typography
            variant="body1"
            sx={(theme) => {
              const isDark = theme.palette.mode === "dark";
              return {
                textAlign: "center",
                mt: 2,
                fontWeight: 900,
                color: isDark ? theme.palette.primary.light : theme.palette.primary.dark,
                opacity: 0.98
              };
            }}
          >
            You haven’t submitted any adoption requests yet.
          </Typography>
        ) : (
          <Grid container spacing={2} justifyContent="center">
            {myRequests.map((req) => {
              const status = getStatusConfig(req.status);

              return (
                <Grid item key={req.id} xs={12} sm={6} md={4} lg={3}>
                  <Card
                    sx={(theme) => ({
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 4,
                      overflow: "hidden",
                      border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                      boxShadow: theme.palette.mode === "dark"
                        ? "0 10px 30px rgba(0,0,0,0.28)"
                        : "0 10px 30px rgba(0,0,0,0.08)",
                      transition: "transform 0.25s ease, box-shadow 0.25s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: theme.palette.mode === "dark"
                          ? "0 16px 38px rgba(0,0,0,0.36)"
                          : "0 16px 38px rgba(0,0,0,0.12)"
                      }
                    })}
                  >
                    <CardMedia
                      component="img"
                      height="190"
                      image={resolveImageSrc(req.animalImage)}
                      alt={req.animalName || "Animal"}
                      onError={(e) => {
                        e.currentTarget.src = "/no-image.png";
                      }}
                    />

                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 900, mb: 0.5 }}>
                        {req.animalName || "Unknown Animal"}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {[req.animalCategory, req.animalLocation].filter(Boolean).join(" • ") || "Animal details unavailable"}
                      </Typography>

                      <Chip
                        icon={status.icon}
                        label={status.label}
                        color={status.color}
                        size="small"
                        sx={{ mt: 0.5, fontWeight: 700 }}
                      />

                      {req.message ? (
                        <Typography
                          variant="body2"
                          sx={(theme) => ({
                            mt: 1.5,
                            color: alpha(theme.palette.text.primary, 0.78),
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden"
                          })}
                        >
                          <strong>Message:</strong> {req.message}
                        </Typography>
                      ) : null}

                      {req.reason && String(req.status || "").toUpperCase() === "REJECTED" ? (
                        <Typography
                          variant="body2"
                          sx={(theme) => ({
                            mt: 1,
                            color: theme.palette.error.main,
                            fontWeight: 700
                          })}
                        >
                          Reason: {req.reason}
                        </Typography>
                      ) : null}
                    </CardContent>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 1.5,
                        pb: 1.5
                      }}
                    >
                      <IconButton
                        aria-label="view"
                        onClick={() => {
                          setSelectedAnimal(buildAnimalFromRequest(req));
                          setOpenDetails(true);
                        }}
                        sx={(theme) => {
                          const isDark = theme.palette.mode === "dark";
                          const c = isDark ? theme.palette.primary.light : theme.palette.primary.main;
                          return {
                            bgcolor: alpha(c, isDark ? 0.1 : 0.08),
                            color: c,
                            border: `1px solid ${alpha(c, isDark ? 0.22 : 0.18)}`,
                            "&:hover": { bgcolor: alpha(c, isDark ? 0.18 : 0.14) }
                          };
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>

                      {req.status === "PENDING" && (
                        <IconButton
                          aria-label="cancel"
                          onClick={() => {
                            setPendingCancel(req);
                            setOpenCancel(true);
                          }}
                          sx={(theme) => {
                            const isDark = theme.palette.mode === "dark";
                            const c = theme.palette.error.main;
                            return {
                              bgcolor: alpha(c, isDark ? 0.12 : 0.1),
                              color: isDark ? theme.palette.error.light : theme.palette.error.dark,
                              border: `1px solid ${alpha(c, isDark ? 0.24 : 0.2)}`,
                              "&:hover": { bgcolor: alpha(c, isDark ? 0.2 : 0.16) }
                            };
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>

      <AnimalDetailsDialog open={openDetails} onClose={() => setOpenDetails(false)}>
        <AnimalDetailsContent
          animal={selectedAnimal}
          currentUserId={user?.id || user?.userId}
          onAdopt={() => {}}
        />
      </AnimalDetailsDialog>

      <ConfirmDialog
        open={openCancel}
        title="Cancel request?"
        description={`Are you sure you want to cancel your request for "${pendingCancel?.animalName || "this animal"}"?`}
        confirmText={cancelLoading ? "Canceling..." : "Yes, cancel"}
        cancelText="Keep request"
        onClose={() => (cancelLoading ? null : setOpenCancel(false))}
        onConfirm={handleCancelConfirmed}
        disableConfirm={cancelLoading}
        disableCancel={cancelLoading}
      />
    </>
  );
}

export default MyAdoptionRequestsPage;