import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useNavigate } from "react-router-dom";

function AnimalCard({ animal }) {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/animal/${animal.id}`, {state: animal})
    }
      sx={{
        width: 260,
        cursor: "pointer",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.08)",
          boxShadow: 10,
          zIndex: 2
        }
      }}
    >
      {/* Image + name overlay */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="170"
          image={animal.image}
          alt={animal.name}
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
          <Typography variant="subtitle1" fontWeight="bold">
            {animal.name}
          </Typography>
        </Box>
      </Box>
      
      <CardContent sx={{ pt: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <LocationOnIcon fontSize="small" color="primary" />
          <Typography variant="body2">
            {animal.location}
          </Typography>
        </Box>

        <Typography variant="body2">
          Age: {animal.age}
        </Typography>

        <Typography variant="body2">
          Category: {animal.category}
        </Typography>

      </CardContent>

    </Card>
  );
}

export default AnimalCard;
