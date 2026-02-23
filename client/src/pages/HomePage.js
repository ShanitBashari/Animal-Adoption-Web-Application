// src/pages/HomePage.js
import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Grid,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import AnimalCard from "../components/AnimalCard";
import { AnimalsApi } from "../api/api"; // <-- ודאי שהנתיב נכון

function HomePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [age, setAge] = useState("");
  const [openFilter, setOpenFilter] = useState(false);

  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await AnimalsApi.list();
        setAnimals(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load animals:", err);
        // אם err.body קיים נציג אותו, אחרת err.message
        const message = err?.body || err?.message || "Unknown error";
        setError(typeof message === "string" ? message : JSON.stringify(message).slice(0, 200));
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, []);

  const filteredAnimals = animals.filter((animal) => {
    const matchesSearch =
      (animal.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (animal.location || "").toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category === "" || animal.category === category;

    const matchesAge =
      age === "" ||
      (age === "young" && (animal.age ?? 0) <= 2) ||
      (age === "adult" && (animal.age ?? 0) > 2);

    return matchesSearch && matchesCategory && matchesAge;
  });

  return (
    <Box sx={{ p: 4 }}>
      {/* App Description */}
      <Box sx={{ textAlign: "center", maxWidth: 800, mx: "auto", mb: 5 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Pet Adoption!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here you can find animals that looking for a new home and start the adoption process
        </Typography>
      </Box>

      {/* Search + Filter */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, mb: 4 }}>
        <TextField
          sx={{ width: "60%" }}
          placeholder="Search for an animal..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={loading}
        />
        <IconButton color="primary" onClick={() => setOpenFilter(true)}>
          <FilterListIcon />
        </IconButton>
      </Box>

      {/* Filter Dialog */}
      <Dialog open={openFilter} onClose={() => setOpenFilter(false)}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Filter Animals</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1, minWidth: 320 }}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Dog">Dog</MenuItem>
              <MenuItem value="Cat">Cat</MenuItem>
              <MenuItem value="Wolf">Wolf</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Age</InputLabel>
            <Select value={age} label="Age" onChange={(e) => setAge(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="young">Young (≤2)</MenuItem>
              <MenuItem value="adult">Adult (3+)</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => { setCategory(""); setAge(""); }}>Clear</Button>
          <Button variant="contained" onClick={() => setOpenFilter(false)}>Apply</Button>
        </DialogActions>
      </Dialog>

      {/* Loading / Error */}
      {loading ? (
        <Typography>Loading animals...</Typography>
      ) : error ? (
        <Typography color="error">Error: {error}</Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {filteredAnimals.length > 0 ? (
            filteredAnimals.map((animal) => (
              <Grid item key={animal.id} xs={12} sm={6} md={4} lg={3}>
                <AnimalCard
                  animal={animal}
                  onDeleted={(deletedId) => setAnimals(prev => prev.filter(a => a.id !== deletedId))}
                />
              </Grid>
            ))
          ) : (
            <Typography>No results found</Typography>
          )}
        </Grid>
      )}
    </Box>
  );
}

export default HomePage;