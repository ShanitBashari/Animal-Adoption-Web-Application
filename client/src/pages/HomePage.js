import { React, useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Grid,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  InputAdornment
} from "@mui/material";

import FilterDialog from "../components/FilterDialog";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

import AnimalCard from "../components/AnimalCard";
import AnimalDetailsDialog from "../components/AnimalDetailsDialog";
import AnimalDetailsContent from "../components/AnimalDetailsContent";
import { AnimalsApi, CategoriesApi } from "../api/api";

import AnimalFormDialog from "../components/AnimalFormDialog";
import AddAnimalForm from "../components/AddAnimalForm";
import { useAuth } from "../auth/AuthContext";

function HomePage() {
  const [search, setSearch] = useState("");

  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    age: "",
    location: "",
    size: "",
    status: ""
  });

  const [openAdd, setOpenAdd] = useState(false);

  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [categories, setCategories] = useState([]);
  const [catsLoading, setCatsLoading] = useState(true);

  const [openDetails, setOpenDetails] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const { user } = useAuth();
  const username = user?.username;
  const isLoggedIn = !!user?.accessToken;

  const addSubmitRef = useRef(null);
  const [addLoading, setAddLoading] = useState(false);

  // load animals
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await AnimalsApi.list();
        setAnimals(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load animals:", err);
        const message = err?.body?.message || err?.body || err?.message || "Unknown error";
        setError(typeof message === "string" ? message : JSON.stringify(message).slice(0, 200));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // load categories
  useEffect(() => {
    let mounted = true;
    async function loadCategories() {
      setCatsLoading(true);
      try {
        const data = await CategoriesApi.list();
        const arr = Array.isArray(data) ? data : [];
        arr.sort((a, b) => {
          const an = (a?.name ?? a).toString();
          const bn = (b?.name ?? b).toString();
          return an.localeCompare(bn, "he", { sensitivity: "base" });
        });
        if (mounted) setCategories(arr);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        if (mounted) setCatsLoading(false);
      }
    }
    loadCategories();
    return () => (mounted = false);
  }, []);

  function categoryNameFromAnimal(animal) {
    if (!animal) return "";
    const c = animal.category;
    if (!c && (animal.categoryName || animal.category_name)) return animal.categoryName || animal.category_name;
    if (typeof c === "string") return c;
    if (typeof c === "number") return "";
    if (typeof c === "object") return c.name || c.label || "";
    return "";
  }

  // client-side filtering (search + dialog filters)
  const filteredAnimals = animals.filter((animal) => {
    const name = (animal.name || "").toString().toLowerCase();
    const loc = (animal.location || "").toString().toLowerCase();

    // search by name or location
    const query = search.toLowerCase().trim();
    const matchesSearch = !query || name.includes(query) || loc.includes(query);

    // category filter
    const selectedCategory = String(filters.category || "");
    const animalCategoryName = String(categoryNameFromAnimal(animal) || "");
    const animalCategoryId =
      animal.category && typeof animal.category === "object" && animal.category.id
        ? String(animal.category.id)
        : animal.category
        ? String(animal.category)
        : "";

    const matchesCategory =
      !selectedCategory ||
      animalCategoryName === selectedCategory ||
      animalCategoryId === selectedCategory;

    // age filter (your dialog values: 0-2 / 3-6 / 7+)
    const ageNum = typeof animal.age === "number" ? animal.age : Number(animal.age) || 0;
    const a = filters.age;
    const matchesAge =
      !a ||
      (a === "0-2" && ageNum <= 2) ||
      (a === "3-6" && ageNum >= 3 && ageNum <= 6) ||
      (a === "7+" && ageNum >= 7);

    // location contains
    const lf = (filters.location || "").toLowerCase().trim();
    const matchesLocation = !lf || loc.includes(lf);

    // size
    const matchesSize =
      !filters.size || String(animal.size || "") === String(filters.size);

    // status
    const matchesStatus =
      !filters.status || String(animal.status || "") === String(filters.status);

    return matchesSearch && matchesCategory && matchesAge && matchesLocation && matchesSize && matchesStatus;
  });

  return (
    <Box sx={{ p: 4 }}>
      {/* Add Animal (only for logged in users) */}
      {isLoggedIn && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAdd(true)}
          sx={{
            position: "fixed",
            top: 90,
            right: 24,
            zIndex: 2000,
            height: 48,
            borderRadius: 999,
            px: 2.5,
            boxShadow: 10
          }}
        >
          Add Animal
        </Button>
      )}

      {/* Header */}
      <Box sx={{ textAlign: "center", maxWidth: 800, mx: "auto", mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {username ? `Welcome to Pet Adoption, ${username} 🐾` : "Welcome to Pet Adoption 🐾"}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here you can find animals that looking for a new home and start the adoption process
        </Typography>
      </Box>

      {/* Search + Filter */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, mb: 3 }}>
        <TextField
          placeholder="Search by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={loading}
          sx={{
            width: { xs: "95%", sm: "70%", md: "55%" },
            "& .MuiInputBase-root": { height: 54, fontSize: 16, borderRadius: 3 }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />

        <IconButton color="primary" onClick={() => setFilterOpen(true)} disabled={loading}>
          <FilterListIcon />
        </IconButton>
      </Box>

      {/* Filter Dialog */}
      <FilterDialog
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        categories={categories}
        onApply={() => setFilterOpen(false)} // no fetch needed (client-side filter)
        onClear={() =>
          setFilters({
            category: "",
            age: "",
            location: "",
            size: "",
            status: ""
          })
        }
      />

      <AnimalFormDialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        title="Add New Animal"
        primaryText="Add Animal"
        secondaryText="Cancel"
        formId="animal-form"
        onSecondary={() => setOpenAdd(false)}
        onPrimary={() => addSubmitRef.current?.()}
        loading={addLoading}
      >
        <AddAnimalForm
          mode="add"
          registerSubmit={(fn) => (addSubmitRef.current = fn)}
          setExternalLoading={setAddLoading}
          onSuccess={(created) => {
            setOpenAdd(false);
            if (created) setAnimals((prev) => [created, ...prev]);
          }}
        />
      </AnimalFormDialog>

      {/* Loading / Error / List */}
      {loading ? (
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">Error: {error}</Typography>
      ) : (
        <Grid container spacing={1.25} justifyContent="center">
          {filteredAnimals.length > 0 ? (
            filteredAnimals.map((animal) => (
              <Grid item key={animal.id} xs={12} sm={6} md={4} lg={2}>
                <AnimalCard
                  animal={animal}
                  onClick={(a) => {
                    setSelectedAnimal(a);
                    setOpenDetails(true);
                  }}
                  onDeleted={(deletedId) =>
                    setAnimals((prev) => prev.filter((x) => x.id !== deletedId))
                  }
                />
              </Grid>
            ))
          ) : (
            <Typography sx={{ m: 4 }}>No results found</Typography>
          )}
        </Grid>
      )}

      {/* Details Dialog */}
      <AnimalDetailsDialog open={openDetails} onClose={() => setOpenDetails(false)}>
        <AnimalDetailsContent animal={selectedAnimal} onAdopt={() => {}} />
      </AnimalDetailsDialog>
    </Box>
  );
}

export default HomePage;