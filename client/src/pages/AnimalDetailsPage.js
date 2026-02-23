// src/pages/AnimalDetailsPage.js
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import PetsIcon from "@mui/icons-material/Pets";
import StraightenIcon from "@mui/icons-material/Straighten";
import InfoIcon from "@mui/icons-material/Info";
import { AnimalsApi, RequestApi } from "../api/api";

export default function AnimalDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // adopt dialog
  const [adoptOpen, setAdoptOpen] = useState(false);
  const [requestName, setRequestName] = useState("");
  const [requestPhone, setRequestPhone] = useState("");
  const [requestMsg, setRequestMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await AnimalsApi.get(id);
        if (mounted) setAnimal(data);
      } catch (err) {
        console.error(err);
        if (mounted) setError(err?.body || err?.message || "Failed to load animal");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  async function handleAdoptSubmit() {
    if (!requestName || !requestPhone) {
      alert("Please enter your name and phone.");
      return;
    }
    setSubmitting(true);
    try {
      const dto = {
        animalId: animal.id,
        userName: requestName,
        userPhone: requestPhone,
        message: requestMsg,
        status: "NEW"
      };
      await RequestApi.create(dto);
      setSuccessMsg("Request submitted — we'll contact you soon.");
      setAdoptOpen(false);
      setRequestName(""); setRequestPhone(""); setRequestMsg("");
    } catch (err) {
      console.error("Request failed:", err);
      alert("Failed to submit request: " + (err?.body || err?.message || ""));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return (
    <Box sx={{ p: 6, display: "flex", justifyContent: "center" }}>
      <CircularProgress />
    </Box>
  );
  if (error) return <Typography color="error" sx={{ p: 4 }}>{error}</Typography>;
  if (!animal) return <Typography sx={{ p: 4 }}>No animal found</Typography>;

  const GenderIcon = animal.gender === "Female" ? FemaleIcon : MaleIcon;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", pt: 6, pb: 10 }}>
      <Box sx={{ width: "100%", maxWidth: 1280 }}>
        <Button onClick={() => navigate(-1)} sx={{ mb: 2, color: "#9ddcff" }}>
          ← Back
        </Button>

        <Paper elevation={10} sx={{
          display: "flex",
          gap: 8,                 // יותר ריווח אופקי בין תמונה לתוכן
          p: 5,                   // יותר ריפוד פנימי
          borderRadius: 6,
          background: "linear-gradient(180deg, #2f3136, #3f4146)",
          alignItems: "flex-start"
        }}>
          <Box sx={{
            width: 520,
            height: 340,
            borderRadius: 4,
            overflow: "hidden",
            flexShrink: 0
          }}>
            <img
              src={animal.image || "https://via.placeholder.com/520x340?text=No+Image"}
              alt={animal.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </Box>

          {/* RIGHT SIDE */}
          <Box sx={{ flex: 1 }}>
            {/* TITLE + BUTTON */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: 0.2 }}>
                  {animal.name}
                </Typography>

                {/* LABELS with improved spacing */}
                <Stack direction="row" spacing={1.25} sx={{ mt: 1, flexWrap: "wrap" }}>
                  {/* Available chip - ברור וירוק */}
                  <Chip
                    icon={<InfoIcon sx={{ color: "white" }} />}
                    label={animal.status || "Unknown"}
                    size="small"
                    sx={{
                      backgroundColor: "#39b54a",   // ירוק מודגש
                      color: "#fff",
                      fontWeight: 700,
                      boxShadow: "0 2px 0 rgba(0,0,0,0.15)"
                    }}
                  />

                  {/* שאר התגים */}
                  <Chip icon={<StraightenIcon />} label={`${animal.age ?? "N/A"} years`} size="small" sx={{ bgcolor: "#4b4f54", color: "#e6e6e6" }} />
                  <Chip icon={<StraightenIcon />} label={animal.size || "—"} size="small" sx={{ bgcolor: "#4b4f54", color: "#e6e6e6" }} />
                  <Chip icon={animal.gender === "Female" ? <FemaleIcon /> : <MaleIcon />} label={animal.gender || "—"} size="small" sx={{ bgcolor: "#4b4f54", color: "#e6e6e6" }} />
                  <Chip icon={<PetsIcon />} label={animal.category || "—"} size="small" sx={{ bgcolor: "#4b4f54", color: "#e6e6e6" }} />
                </Stack>
              </Box>

              <Button variant="contained" onClick={() => setAdoptOpen(true)} sx={{
                background: "#56bd63",
                color: "#04140a",
                fontWeight: 800,
                px: 4,
                borderRadius: 4,
                height: 44,
                alignSelf: "flex-start",
                boxShadow: "0 6px 18px rgba(0,0,0,0.35)"
              }}>
                ADOPT NOW
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* DETAILS GRID with larger spacing */}
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", gap: 1.25, alignItems: "center", mb: 1.25 }}>
                  <LocationOnIcon sx={{ color: "#cfeaf0", fontSize: 22 }} />
                  <Box>
                    <Typography color="text.secondary" variant="subtitle2">Location</Typography>
                    <Typography fontWeight={700} sx={{ mt: 0.5 }}>{animal.location || "-"}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1.25, alignItems: "center", mt: 3 }}>
                  <InfoIcon sx={{ color: "#cfeaf0", fontSize: 22 }} />
                  <Box>
                    <Typography color="text.secondary" variant="subtitle2">Description</Typography>
                    <Typography sx={{ mt: 0.5 }}>{animal.description || "-"}</Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", gap: 1.25, alignItems: "center", mb: 1.25 }}>
                  <PhoneIcon sx={{ color: "#cfeaf0", fontSize: 22 }} />
                  <Box>
                    <Typography color="text.secondary" variant="subtitle2">Owner Details</Typography>
                    <Typography fontWeight={700} sx={{ mt: 0.5 }}>{animal.ownerName || "-"}</Typography>
                    <Typography sx={{ mt: 0.25 }}>{animal.ownerPhone || "-"}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1.25, alignItems: "flex-start", mt: 3 }}>
                  <Box sx={{ mt: 0.25 }}>
                    <GenderIcon sx={{ color: "#cfeaf0", fontSize: 20 }} />
                  </Box>

                  <Box>
                    <Typography color="text.secondary" variant="subtitle2">Attributes</Typography>
                    <Box sx={{ display: "flex", gap: 1.25, mt: 0.75, flexWrap: "wrap" }}>
                      <Chip icon={<MaleIcon />} label={animal.gender || "-"} size="small" sx={{ bgcolor: "#4b4f54", color: "#e6e6e6" }} />
                      <Chip icon={<PetsIcon />} label={animal.category || "-"} size="small" sx={{ bgcolor: "#4b4f54", color: "#e6e6e6" }} />
                      <Chip icon={<StraightenIcon />} label={animal.size || "-"} size="small" sx={{ bgcolor: "#4b4f54", color: "#e6e6e6" }} />
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>

      {/* Adopt dialog */}
      <Dialog open={adoptOpen} onClose={() => setAdoptOpen(false)}>
        <DialogTitle>Request adoption for {animal.name}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 320 }}>
          <TextField label="Your name" value={requestName} onChange={(e) => setRequestName(e.target.value)} />
          <TextField label="Phone" value={requestPhone} onChange={(e) => setRequestPhone(e.target.value)} />
          <TextField label="Message (optional)" multiline rows={3} value={requestMsg} onChange={(e) => setRequestMsg(e.target.value)} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAdoptOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdoptSubmit} disabled={submitting}>
            {submitting ? "Sending..." : "Send request"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}