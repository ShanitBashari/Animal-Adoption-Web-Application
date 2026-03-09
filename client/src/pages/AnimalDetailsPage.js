// src/pages/AnimalDetailsPage.js
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { RequestsApi } from "../api/api";
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
import { AnimalsApi } from "../api/api";

export default function AnimalDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [successMsg, setSuccessMsg] = useState(null);
  const [adoptOpen, setAdoptOpen] = useState(false);
  const [requestName, setRequestName] = useState("");
  const [requestPhone, setRequestPhone] = useState("");
  const [requestMsg, setRequestMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // snackbar state
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackSeverity, setSnackSeverity] = useState("success");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await AnimalsApi.get(id);
        if (mounted) {
          // debug: console.log("Loaded animal:", data);
          setAnimal(data);
        }
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
      setSnackSeverity("error");
      setSnackMsg("Please enter your name and phone.");
      setSnackOpen(true);
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

      // קריאה ל־backend
      const created = await RequestsApi.create(dto);

      // צלחנו
      setSnackSeverity("success");
      setSnackMsg("Request sent — we'll contact you soon.");
      setSnackOpen(true);

      // איפוס וסגירת דיאלוג
      setAdoptOpen(false);
      setRequestName("");
      setRequestPhone("");
      setRequestMsg("");
    } catch (err) {
      console.error("Request create failed:", err);
      // יכול להיות err.body או err.message כפי ש-handleResponse מכניס
      const detail = err?.body?.message || err?.body || err?.message || "Failed to send request";
      setSnackSeverity("error");
      setSnackMsg(String(detail));
      setSnackOpen(true);
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

  // build imageSrc robustly:
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";
  const raw = animal.image || "";
  const imageSrc = raw
    ? (raw.startsWith("http") || raw.startsWith("data:") ? raw : `${API_BASE}${raw.startsWith("/") ? "" : "/"}${raw}`)
    : null;

  // colors
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

        {/* LANDSCAPE CARD: wide, short, centered */}
        <Paper
          elevation={10}
          sx={{
            width: "100%",
            maxWidth: "100%",
            mx: "auto",
            display: "flex",
            flexDirection: { xs: "column", md: "row" }, // column on small screens, row on desktop
            alignItems: "center",
            gap: { xs: 2, md: 6 },
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 6,
            background: "linear-gradient(180deg, #2f3136, #3f4146)",
            // reduce perceived height: make shadow subtle and compact
            boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
          }}
        >
          {/* IMAGE: fixed percentage width on desktop, aspect-ratio keeps it landscape and not tall */}
          <Box
            sx={{
              flex: { xs: "0 0 auto", md: "0 0 48%" },
              width: { xs: "100%", md: "48%" },
              aspectRatio: { xs: "16/9", md: "16/10" }, // short & wide
              borderRadius: { xs: 2, md: 3 },
              overflow: "hidden",
              backgroundColor: "#1f2226",
              display: "block",
              boxShadow: "inset 0 0 0 4px rgba(0,0,0,0.15)",
            }}
          >
            <img
              src={imageSrc || "https://via.placeholder.com/1200x800?text=No+Image"}
              alt={animal.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </Box>

          {/* DETAILS: right side, centered vertically, take rest width */}
          <Box
            sx={{
              flex: { xs: "0 0 auto", md: "1 1 52%" },
              width: { xs: "100%", md: "52%" },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            {/* TITLE + CTA */}
            <Box sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2
            }}>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: 0.4, color: primaryTextColor }}>
                  {animal.name || "—"}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                  <Chip icon={<InfoIcon sx={{ color: "white" }} />} label={animal.status || "Unknown"} size="small"
                    sx={{ backgroundColor: "#39b54a", color: "#fff", fontWeight: 700 }} />
                  <Chip icon={<StraightenIcon />} label={`${animal.age ?? "N/A"} years`} size="small" sx={{ bgcolor: "#4b4f54", color: "#e6e6e6" }} />
                  <Chip icon={<StraightenIcon />} label={animal.size || "—"} size="small" sx={{ bgcolor: "#4b4f54", color: "#e6e6e6" }} />
                  <Chip icon={animal.gender === "Female" ? <FemaleIcon /> : <MaleIcon />} label={animal.gender || "—"} size="small" sx={{ bgcolor: "#4b4f54", color: "#e6e6e6" }} />
                  <Chip icon={<PetsIcon />} label={animal.category || "—"} size="small" sx={{ bgcolor: "#4b4f54", color: "#e6e6e6" }} />
                </Stack>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Button variant="contained" onClick={() => setAdoptOpen(true)} sx={{
                  background: "#56bd63",
                  color: "#04140a",
                  fontWeight: 800,
                  px: 3,
                  borderRadius: 4,
                  height: 44,
                  boxShadow: "0 6px 18px rgba(0,0,0,0.35)"
                }}>
                  ADOPT NOW
                </Button>
              </Box>
            </Box>

            <Divider sx={{ my: 3, borderColor: "#444" }} />

            {/* DETAILS GRID */}
            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", gap: 1.25, alignItems: "center", mb: 1.25 }}>
                  <LocationOnIcon sx={{ color: secondaryTextColor, fontSize: 22 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: secondaryTextColor }}>Location</Typography>
                    <Typography fontWeight={700} sx={{ mt: 0.5, color: primaryTextColor }}>{animal.location || "-"}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1.25, alignItems: "center", mt: 2 }}>
                  <InfoIcon sx={{ color: secondaryTextColor, fontSize: 22 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: secondaryTextColor }}>Description</Typography>
                    <Typography sx={{ mt: 0.5, color: primaryTextColor }}>{animal.description || "-"}</Typography>
                  </Box>
                </Box>
              </Grid>
              {/* OWNER DETAILS */}
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: secondaryTextColor }}>Owner Details</Typography>

                  {/* name row: person icon + bold name */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                    <PersonIcon sx={{ color: "#cfeaf0", fontSize: 20 }} />
                    <Typography fontWeight={700} sx={{ color: primaryTextColor }}>
                      {animal.ownerName || "-"}
                    </Typography>
                  </Box>

                  {/* phone row: phone icon inline with number and clickable tel: */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.75 }}>
                    <PhoneIcon sx={{ color: "#cfeaf0", fontSize: 18 }} />
                    <Typography
                      sx={{ color: primaryTextColor, cursor: animal.ownerPhone ? "pointer" : "default", userSelect: "none" }}
                      onClick={() => { if (animal.ownerPhone) window.location.href = `tel:${animal.ownerPhone}`; }}
                    >
                      {animal.ownerPhone || "-"}
                    </Typography>
                  </Box>
                </Box>

                {/* Attributes block unchanged */}
                <Box sx={{ display: "flex", gap: 1.25, alignItems: "flex-start", mt: 2 }}>
                  <Box sx={{ mt: 0.25 }}>
                    <GenderIcon sx={{ color: secondaryTextColor, fontSize: 20 }} />
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" sx={{ color: secondaryTextColor }}>Attributes</Typography>
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

        {/* optionally: success message */}
        {successMsg && (
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ color: "#9ddcff" }}>{successMsg}</Typography>
          </Box>
        )}
      </Box>

      {/* Adopt dialog */}
      <Dialog
        open={adoptOpen}
        onClose={() => setAdoptOpen(false)}

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
      <Snackbar
        open={snackOpen}
        autoHideDuration={3500}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackOpen(false)} severity={snackSeverity} sx={{ width: "100%" }}>
          {snackMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}