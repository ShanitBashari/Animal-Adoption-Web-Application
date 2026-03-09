// src/pages/AnimalDetailsPage.js
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Divider,
  Stack,
  Paper,
  Grid
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import PersonIcon from "@mui/icons-material/Person";
import PetsIcon from "@mui/icons-material/Pets";
import StraightenIcon from "@mui/icons-material/Straighten";
import InfoIcon from "@mui/icons-material/Info";

import { AnimalsApi, RequestsApi } from "../api/api";
import { useAuth } from "../auth/AuthContext";

export default function AnimalDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [adoptOpen, setAdoptOpen] = useState(false);
  const [requestMsg, setRequestMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackSeverity, setSnackSeverity] = useState("success");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const data = await AnimalsApi.get(id);

        if (mounted) {
          setAnimal(data);
        }
      } catch (err) {
        console.error("Failed to load animal:", err);
        if (mounted) {
          setError(err?.body || err?.message || "Failed to load animal");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [id]);

  async function handleAdoptSubmit() {
    if (!user?.accessToken) {
      setSnackSeverity("error");
      setSnackMsg("Please log in before sending an adoption request.");
      setSnackOpen(true);
      return;
    }

    if (!user?.id) {
      setSnackSeverity("error");
      setSnackMsg("User information is missing. Please log in again.");
      setSnackOpen(true);
      return;
    }

    if (!animal?.id) {
      setSnackSeverity("error");
      setSnackMsg("Animal information is missing.");
      setSnackOpen(true);
      return;
    }

    setSubmitting(true);

    try {
      await RequestsApi.create({
        animalId: animal.id,
        userId: user.id,
        message: requestMsg || ""
      });

      setSnackSeverity("success");
      setSnackMsg("Request sent successfully.");
      setSnackOpen(true);

      setAdoptOpen(false);
      setRequestMsg("");

    } catch (err) {
      console.error("Request create failed:", err);

      const detail =
        err?.body?.message ||
        err?.body ||
        err?.message ||
        "Failed to send request";

      setSnackSeverity("error");
      setSnackMsg(String(detail));
      setSnackOpen(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <Box sx={{ p: 6, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ p: 4 }}>
        {String(error)}
      </Typography>
    );
  }

  if (!animal) {
    return <Typography sx={{ p: 4 }}>No animal found</Typography>;
  }

  const GenderIcon = animal.gender === "Female" ? FemaleIcon : MaleIcon;

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";
  const raw = animal.image || "";
  const imageSrc = raw
    ? raw.startsWith("http") || raw.startsWith("data:")
      ? raw
      : `${API_BASE}${raw.startsWith("/") ? "" : "/"}${raw}`
    : null;

  const primaryTextColor = "#ffffff";
  const secondaryTextColor = "#cfeaf0";

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 4, md: 8 },
        bgcolor: "transparent"
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 1360 }}>
        <Button onClick={() => navigate(-1)} sx={{ mb: 2, color: "#9ddcff" }}>
          ← BACK
        </Button>

        <Paper
          elevation={10}
          sx={{
            width: "100%",
            maxWidth: "100%",
            mx: "auto",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: { xs: 2, md: 6 },
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 6,
            background: "linear-gradient(180deg, #2f3136, #3f4146)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.45)"
          }}
        >
          <Box
            sx={{
              flex: { xs: "0 0 auto", md: "0 0 48%" },
              width: { xs: "100%", md: "48%" },
              aspectRatio: { xs: "16/9", md: "16/10" },
              borderRadius: { xs: 2, md: 3 },
              overflow: "hidden",
              backgroundColor: "#1f2226",
              display: "block",
              boxShadow: "inset 0 0 0 4px rgba(0,0,0,0.15)"
            }}
          >
            <img
              src={imageSrc || "https://via.placeholder.com/1200x800?text=No+Image"}
              alt={animal.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block"
              }}
            />
          </Box>

          <Box
            sx={{
              flex: { xs: "0 0 auto", md: "1 1 52%" },
              width: { xs: "100%", md: "52%" },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 2
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="h3"
                  fontWeight={900}
                  sx={{ letterSpacing: 0.4, color: primaryTextColor }}
                >
                  {animal.name || "—"}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                  <Chip
                    icon={<InfoIcon sx={{ color: "white" }} />}
                    label={animal.status || "Unknown"}
                    size="small"
                    sx={{
                      backgroundColor: "#39b54a",
                      color: "#fff",
                      fontWeight: 700
                    }}
                  />
                  <Chip
                    icon={<StraightenIcon />}
                    label={`${animal.age ?? "N/A"} years`}
                    size="small"
                    sx={{ bgcolor: "#4b4f54", color: "#e6e6e6" }}
                  />
                  <Chip
                    icon={<StraightenIcon />}
                    label={animal.size || "—"}
                    size="small"
                    sx={{ bgcolor: "#4b4f54", color: "#e6e6e6" }}
                  />
                  <Chip
                    icon={animal.gender === "Female" ? <FemaleIcon /> : <MaleIcon />}
                    label={animal.gender || "—"}
                    size="small"
                    sx={{ bgcolor: "#4b4f54", color: "#e6e6e6" }}
                  />
                  <Chip
                    icon={<PetsIcon />}
                    label={animal.category || "—"}
                    size="small"
                    sx={{ bgcolor: "#4b4f54", color: "#e6e6e6" }}
                  />
                </Stack>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (!user?.accessToken) {
                      setSnackSeverity("error");
                      setSnackMsg("Please log in to send an adoption request.");
                      setSnackOpen(true);
                      return;
                    }
                    setAdoptOpen(true);
                  }}
                  sx={{
                    background: "#56bd63",
                    color: "#04140a",
                    fontWeight: 800,
                    px: 3,
                    borderRadius: 4,
                    height: 44,
                    boxShadow: "0 6px 18px rgba(0,0,0,0.35)"
                  }}
                >
                  ADOPT NOW
                </Button>
              </Box>
            </Box>

            <Divider sx={{ my: 3, borderColor: "#444" }} />

            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", gap: 1.25, alignItems: "center", mb: 1.25 }}>
                  <LocationOnIcon sx={{ color: secondaryTextColor, fontSize: 22 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: secondaryTextColor }}>
                      Location
                    </Typography>
                    <Typography
                      fontWeight={700}
                      sx={{ mt: 0.5, color: primaryTextColor }}
                    >
                      {animal.location || "-"}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1.25, alignItems: "center", mt: 2 }}>
                  <InfoIcon sx={{ color: secondaryTextColor, fontSize: 22 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: secondaryTextColor }}>
                      Description
                    </Typography>
                    <Typography sx={{ mt: 0.5, color: primaryTextColor }}>
                      {animal.description || "-"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: secondaryTextColor }}>
                    Owner Details
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                    <PersonIcon sx={{ color: "#cfeaf0", fontSize: 20 }} />
                    <Typography fontWeight={700} sx={{ color: primaryTextColor }}>
                      {animal.ownerName || "-"}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.75 }}>
                    <PhoneIcon sx={{ color: "#cfeaf0", fontSize: 18 }} />
                    <Typography
                      sx={{
                        color: primaryTextColor,
                        cursor: animal.ownerPhone ? "pointer" : "default",
                        userSelect: "none"
                      }}
                      onClick={() => {
                        if (animal.ownerPhone) {
                          window.location.href = `tel:${animal.ownerPhone}`;
                        }
                      }}
                    >
                      {animal.ownerPhone || "-"}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1.25, alignItems: "flex-start", mt: 2 }}>
                  <Box sx={{ mt: 0.25 }}>
                    <GenderIcon sx={{ color: secondaryTextColor, fontSize: 20 }} />
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" sx={{ color: secondaryTextColor }}>
                      Attributes
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1.25, mt: 0.75, flexWrap: "wrap" }}>
                      <Chip
                        icon={animal.gender === "Female" ? <FemaleIcon /> : <MaleIcon />}
                        label={animal.gender || "-"}
                        size="small"
                        sx={{ bgcolor: "#4b4f54", color: "#e6e6e6" }}
                      />
                      <Chip
                        icon={<PetsIcon />}
                        label={animal.category || "-"}
                        size="small"
                        sx={{ bgcolor: "#4b4f54", color: "#e6e6e6" }}
                      />
                      <Chip
                        icon={<StraightenIcon />}
                        label={animal.size || "-"}
                        size="small"
                        sx={{ bgcolor: "#4b4f54", color: "#e6e6e6" }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>

      <Dialog
        open={adoptOpen}
        onClose={() => {
          if (!submitting) setAdoptOpen(false);
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0,0,0,0.7)"
          }
        }}
        PaperProps={{
          sx: {
            background: "linear-gradient(180deg, #1c1d21, #2b2d31)",
            color: "#fff",
            borderRadius: 3,
            gap: 2,
            boxShadow: "0 20px 60px rgba(0,0,0,0.8)"
          }
        }}
      >
        <DialogTitle>Request adoption for {animal.name}</DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: 320
          }}
        >
          <TextField
            label="Message (optional)"
            multiline
            rows={4}
            value={requestMsg}
            onChange={(e) => setRequestMsg(e.target.value)}
            disabled={submitting}
            fullWidth
            InputLabelProps={{ sx: { color: "#cfeaf0" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": { borderColor: "#5a5d63" },
                "&:hover fieldset": { borderColor: "#8aa9b0" },
                "&.Mui-focused fieldset": { borderColor: "#9ddcff" }
              }
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAdoptOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAdoptSubmit} disabled={submitting}>
            {submitting ? "Sending..." : "Send request"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackOpen}
        autoHideDuration={3500}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity={snackSeverity}
          sx={{ width: "100%" }}
        >
          {snackMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}