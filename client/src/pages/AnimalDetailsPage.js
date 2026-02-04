import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  Divider,
  Button,
  Chip,
  Fab
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import PetsIcon from "@mui/icons-material/Pets";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import StraightenIcon from "@mui/icons-material/Straighten";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function AnimalDetailsPage() {
  const { state: animal } = useLocation();
  const navigate = useNavigate();

  if (!animal) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6">Animal not found</Typography>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </Box>
    );
  }

  return (
    <>
    {/* ⬅ Back */}
    <Box
      onClick={() => navigate("/")}
      sx={{
        position: "fixed",
        top: 90,
        left: 24,
        display: "flex",
        alignItems: "center",
        gap: 1,
        cursor: "pointer",
        color: "#b7edfc",
        fontWeight: "bold",
        opacity: 0.9,
        transition: "0.2s",
        "&:hover": {
          opacity: 1,
          transform: "translateX(-4px)"
        }
      }}
    >
      <ArrowBackIcon />
      <Typography variant="body2">Back to Home</Typography>
    </Box>

      <Box sx={{ p: 4, maxWidth: 1200, mx: "auto" }}>
        <Card sx={{ p: 4, borderRadius: 4 }}>
          <Grid container spacing={4} alignItems="flex-start">

            {/* 🖼 IMAGE – FIXED SIZE */}
            <Grid item xs={12} md={5}>
              <Box
                component="img"
                src={animal.image}
                alt={animal.name}
                sx={{
                  width: "100%",
                  maxWidth: 420,
                  height: "auto",
                  borderRadius: 3,
                  display: "block",
                  mx: "auto",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "scale(1.04)" }
                }}
              />
            </Grid>

            {/* 📄 DETAILS */}
            <Grid item xs={12} md={7}>
              <Typography variant="h4" gutterBottom>
                {animal.name}
              </Typography>

              <Chip
                label={animal.status}
                color={animal.status === "Available" ? "success" : "warning"}
                sx={{ fontWeight: "bold", mb: 2 }}
              />

              {/* Quick facts */}
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                <Chip label={`${animal.age} years`} />
                <Chip label={animal.size} />
                <Chip label={animal.gender} />
                <Chip label={animal.category} />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PetsIcon color="primary" />
                <Typography>{animal.category}</Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOnIcon color="primary" />
                <Typography>{animal.location}</Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {animal.gender === "Female" ? (
                  <FemaleIcon color="primary" />
                ) : (
                  <MaleIcon color="primary" />
                )}
                <Typography>{animal.gender}</Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <StraightenIcon color="primary" />
                <Typography>{animal.size}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6">Description</Typography>
              <Typography color="text.secondary">
                {animal.description}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6">Owner Details</Typography>
              <Typography>Name: {animal.ownerName}</Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <PhoneIcon color="primary" />
                <Typography>{animal.ownerPhone}</Typography>
              </Box>

              {/* CTA */}
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "rgba(76,175,80,0.15)",
                  textAlign: "center"
                }}
              >
                <Typography sx={{ mb: 1 }}>
                  Interested in giving {animal.name} a new home?
                </Typography>

                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  sx={{ px: 4 }}
                >
                  Adopt Now!
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </>
  );
}

export default AnimalDetailsPage;
