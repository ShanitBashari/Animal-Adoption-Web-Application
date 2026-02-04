import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  Container
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { animals } from "./mockData"

import { useNavigate } from "react-router-dom";

const AdoptionRequestsPage = () => {
    const navigate = useNavigate();
    const myRequests = [
      {
        id: 1,
        status: "Pending",
        animal: animals[0]
      },
      {
        id: 2,
        status: "Approved",
        animal: animals[2]
      },
      {
        id: 3,
        status: "Rejected",
        animal: animals[3]
      }
    ];

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
          My Adoption Requests
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "white",
            opacity: 0.9,
            maxWidth: 800,
            margin: "0 auto",
            lineHeight: 1.6
          }}
        >
          Track the adoption requests you’ve submitted
        </Typography>
      </Box>

      {/* CENTERED REQUESTS GRID */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Grid container spacing={4} sx={{ maxWidth: 1200 }}>
          {myRequests.map((req) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={req.id}
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
                  image={req.animal.image}
                  alt={req.animal.name}
                />

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">
                    {req.animal.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {req.animal.category} • {req.animal.location}
                  </Typography>

                  <Chip
                    label={req.status}
                    color={
                      req.status === "Approved"
                        ? "success"
                        : req.status === "Pending"
                        ? "warning"
                        : "error"
                    }
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
                      navigate(`/animal/${req.animal.id}`, {
                        state: req.animal
                      })
                    }
                  >
                    <VisibilityIcon />
                  </IconButton>

                  {req.status === "Pending" && (
                    <IconButton color="error">
                      <DeleteIcon />
                    </IconButton>
                  )}
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

export default AdoptionRequestsPage