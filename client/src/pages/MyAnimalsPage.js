import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Grid,
  Container
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useNavigate } from "react-router-dom";
import { animals } from "./mockData"; // mock data

function MyAnimalsPage() {
  const navigate = useNavigate();

  // 🔹 mock: assume these are "my animals"
  const myAnimals = animals.slice(0, 4);

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

    <Container maxWidth="lg" sx={{ mt: 6 }}>
      {/* TITLE + DESCRIPTION */}
      <Box sx={{ textAlign: "center", mb: 6, px: 2 }}>
        <Typography
          variant="h3"
          sx={{
            color: "#b7edfc",
            mb: 2,
            fontWeight: "bold"
          }}
        >
          My Animals
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "white",
            opacity: 0.9,
            maxWidth: 700,
            margin: "0 auto",
            lineHeight: 1.6
          }}
        >
          Here you can manage the animals you’ve listed for adoption.
          View details, edit information, or remove an animal from the system.
        </Typography>
      </Box>

      {/* CENTERED ANIMALS GRID */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Grid
          container
          spacing={4}
          sx={{ maxWidth: 1200 }}
        >
          {myAnimals.map((animal) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={animal.id}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.03)" }
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={animal.image}
                  alt={animal.name}
                />

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">
                    {animal.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {animal.category} • {animal.location}
                  </Typography>

                  <Chip
                    label="Available"
                    color="success"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </CardContent>

                {/* ACTIONS */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    pb: 1
                  }}
                >
                  <IconButton
                    color="primary"
                    onClick={() =>
                      navigate(`/animal/${animal.id}`, {
                        state: animal
                      })
                    }
                  >
                    <VisibilityIcon />
                  </IconButton>

                  <IconButton color="warning">
                    <EditIcon />
                  </IconButton>

                  <IconButton color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  </>
);

}

export default MyAnimalsPage;

