import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useNavigate } from "react-router-dom";
import { animals } from "./mockData";

function AdminAnimalsPage() {
  const navigate = useNavigate();

  const isAdmin = true; // 🔒 MOCK ADMIN

  const [openDelete, setOpenDelete] = React.useState(false);
  const [selectedAnimal, setSelectedAnimal] = React.useState(null);

  if (!isAdmin) {
    return (
      <Typography sx={{ mt: 10, textAlign: "center" }}>
        Access Denied
      </Typography>
    );
  }

  return (
    <>
      {/* ⬅ Back */}
      <Box
        onClick={() => navigate("/admin")}
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
          "&:hover": {
            opacity: 1,
            transform: "translateX(-4px)"
          }
        }}
      >
        <ArrowBackIcon />
        <Typography variant="body2">Back to Dashboard</Typography>
      </Box>

      <Box sx={{ p: 4 }}>
        {/* TITLE */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            sx={{ color: "#b7edfc", fontWeight: "bold" }}
          >
            Manage Animals
          </Typography>

          <Typography sx={{ color: "white", opacity: 0.9 }}>
            View and manage all animals in the system.
          </Typography>
        </Box>

        {/* GRID */}
        <Grid container spacing={3}>
          {animals.map((animal) => (
            <Grid item xs={12} sm={6} md={4} key={animal.id}>
              <Card
                sx={{
                  position: "relative",
                  height: "100%",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "scale(1.04)"
                  }
                }}
              >
                {/* DELETE ICON */}
                <IconButton
                  color="error"
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    zIndex: 2,
                    backgroundColor: "rgba(0,0,0,0.6)"
                  }}
                  onClick={() => {
                    setSelectedAnimal(animal);
                    setOpenDelete(true);
                  }}
                >
                  <DeleteIcon />
                </IconButton>

                <CardMedia
                  component="img"
                  height="200"
                  image={animal.image}
                  alt={animal.name}
                />

                <CardContent>
                  <Typography variant="h6">
                    {animal.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {animal.category} • {animal.location}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* DELETE DIALOG */}
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#1e1e2f",
            color: "white",
            borderRadius: 3
          }
        }}
      >
        <DialogTitle sx={{ color: "#ff6b6b", fontWeight: "bold" }}>
          Delete Animal
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ color: "rgba(255,255,255,0.85)" }}>
            Are you sure you want to permanently delete{" "}
            <b>{selectedAnimal?.name}</b>?
            <br /><br />
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpenDelete(false)}
            sx={{ color: "#b7edfc" }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={() => {
              // MOCK DELETE
              setOpenDelete(false);
              setSelectedAnimal(null);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AdminAnimalsPage;
