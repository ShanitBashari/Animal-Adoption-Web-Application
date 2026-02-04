import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  Container,
  TextField,
  Typography,
  MenuItem,
  Snackbar,
  Alert,
  Fab,
  InputAdornment
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PetsIcon from "@mui/icons-material/Pets";
import ImageIcon from "@mui/icons-material/Image";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";

import { useNavigate } from "react-router-dom";

function AddAnimalPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "",
    gender: "",
    size: "",
    location: "",
    description: "",
    ownerName: "",
    ownerPhone: "",
    image: null
  });

  const [preview, setPreview] = useState(null);
  const [openSnack, setOpenSnack] = useState(false);

  const isFormValid =
    form.name &&
    form.category &&
    form.gender &&
    form.size &&
    form.location &&
    form.ownerName &&
    form.ownerPhone;

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

      <Container maxWidth="sm" sx={{ mt: 8, mb: 6 }}>
        <Card sx={{ p: 4, borderRadius: 4 }}>
          {/* TITLE */}
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              color: "#b7edfc",
              fontWeight: "bold",
              mb: 3
            }}
          >
            Add A New Animal
          </Typography>

          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            {/* Animal Name */}
            <TextField
              fullWidth
              required
              label="Animal Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PetsIcon />
                  </InputAdornment>
                )
              }}
            />

            {/* Category + Location */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                select
                fullWidth
                required
                label="Category"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                <MenuItem value="Dog">Dog</MenuItem>
                <MenuItem value="Cat">Cat</MenuItem>
                <MenuItem value="Wolf">Wolf</MenuItem>
              </TextField>

              <Autocomplete
                options={["Tel Aviv", "Haifa", "Jerusalem", "Beer Sheva"]}
                value={form.location}
                onChange={(e, value) =>
                  setForm({ ...form, location: value || "" })
                }
                renderInput={(params) => (
                  <TextField {...params} required label="Location" />
                )}
                fullWidth
              />
            </Box>

            {/* Gender + Size */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                select
                fullWidth
                required
                label="Gender"
                value={form.gender}
                onChange={(e) =>
                  setForm({ ...form, gender: e.target.value })
                }
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>

              <TextField
                select
                fullWidth
                required
                label="Size"
                value={form.size}
                onChange={(e) =>
                  setForm({ ...form, size: e.target.value })
                }
              >
                <MenuItem value="Small">Small</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Large">Large</MenuItem>
              </TextField>
            </Box>

            {/* Upload Image */}
            <Button
              component="label"
              variant="outlined"
              startIcon={<ImageIcon />}
              fullWidth
            >
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setForm({ ...form, image: file });
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </Button>

            {preview && (
              <Box sx={{ textAlign: "center" }}>
                <img
                  src={preview}
                  alt="preview"
                  style={{
                    width: 120,
                    borderRadius: 8,
                    marginTop: 8
                  }}
                />
              </Box>
            )}

            {/* Description */}
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            {/* Owner Name + Phone */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                required
                label="Owner Name"
                value={form.ownerName}
                onChange={(e) =>
                  setForm({ ...form, ownerName: e.target.value })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                fullWidth
                required
                label="Owner Phone"
                value={form.ownerPhone}
                onChange={(e) =>
                  setForm({ ...form, ownerPhone: e.target.value })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            {/* Submit */}
            <Button
              variant="contained"
              color="success"
              size="large"
              disabled={!isFormValid}
              sx={{
                mt: 3,
                alignSelf: "center",
                px: 6,
                py: 1.5,
                fontWeight: "bold"
              }}
              onClick={() => {
                setOpenSnack(true);
                setTimeout(() => navigate("/"), 1500);
              }}
            >
              Add Animal
            </Button>
          </Box>
        </Card>
      </Container>

      <Snackbar
        open={openSnack}
        autoHideDuration={2000}
        onClose={() => setOpenSnack(false)}
      >
        <Alert severity="success" variant="filled">
          Animal added successfully!
        </Alert>
      </Snackbar>
    </>
  );
}

export default AddAnimalPage;
