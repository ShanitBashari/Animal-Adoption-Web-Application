import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import CakeIcon from "@mui/icons-material/Cake";
import PetsIcon from "@mui/icons-material/Pets";

function AnimalCard({ animal, onClick }) {
  const API_BASE = process.env.REACT_APP_API_URL;

  /**
   * Resolves the image source from different possible formats:
   * - base64 image
   * - full URL
   * - backend relative path
   * Falls back to a default image if none exists.
   */
  const raw = animal?.image || "";
  const imageSrc = raw
    ? raw.startsWith("data:") || raw.startsWith("http")
      ? raw
      : `${API_BASE}${raw.startsWith("/") ? "" : "/"}${raw}`
    : "/no-image.png";

  return (
    <Card
      onClick={() => onClick?.(animal)}
      sx={{
        width: 260,
        height: 280,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.08)",
          boxShadow: 10,
          zIndex: 2
        }
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="170"
          image={imageSrc || "/no-image.png"}
          alt={animal.name || "Animal"}
          onError={(e) => {
            e.currentTarget.src = "/placeholder-animal.png";
          }}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            bgcolor: "rgba(0,0,0,0.6)",
            color: "white",
            px: 1,
            py: 0.5
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold" noWrap>
            {animal.name}
          </Typography>
        </Box>
      </Box>

      <CardContent
        sx={{
          pt: 1,
          flexGrow: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: 0.5
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <LocationOnIcon fontSize="small" color="primary" />
          <Typography variant="body2" noWrap>
            {animal.location}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <CakeIcon fontSize="small" color="secondary" />
          <Typography variant="body2" noWrap>
            Age: {animal.age}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <PetsIcon fontSize="small" color="success" />
          <Typography
            variant="body2"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}
          >
            Category: {animal.category}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default AnimalCard;