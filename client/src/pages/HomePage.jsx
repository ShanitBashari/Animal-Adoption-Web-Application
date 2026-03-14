import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Grid,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from "@mui/material";

import FilterDialog from "../components/FilterDialog";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

import AnimalCard from "../components/AnimalCard";
import AnimalDetailsDialog from "../components/AnimalDetailsDialog";
import AnimalDetailsContent from "../components/AnimalDetailsContent";
import { AnimalsApi, CategoriesApi, RequestsApi } from "../api/api";

import AnimalFormDialog from "../components/AnimalFormDialog";
import AddAnimalForm from "../components/AddAnimalForm";
import { useAuth } from "../auth/AuthContext";
import { scrollbarStyle } from "../styles/scrollbar";

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
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const [adoptOpen, setAdoptOpen] = useState(false);
  const [requestMsg, setRequestMsg] = useState("");
  const [submittingRequest, setSubmittingRequest] = useState(false);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackSeverity, setSnackSeverity] = useState("success");

  const { user } = useAuth();
  const username = user?.username;
  const isLoggedIn = !!user?.accessToken;

  const addSubmitRef = useRef(null);
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const data = await AnimalsApi.list();
        setAnimals(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load animals:", err);

        const message =
          err?.body?.message ||
          err?.body ||
          err?.message ||
          "Unknown error";

        setError(
          typeof message === "string"
            ? message
            : JSON.stringify(message).slice(0, 200)
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      try {
        const data = await CategoriesApi.listActive();
        const arr = Array.isArray(data) ? data : [];

        arr.sort((a, b) => {
          const an = (a?.name ?? a).toString();
          const bn = (b?.name ?? b).toString();
          return an.localeCompare(bn, "he", { sensitivity: "base" });
        });

        if (mounted) setCategories(arr);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    }

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  function categoryNameFromAnimal(animal) {
    if (!animal) return "";

    const c = animal.category;

    if (!c && (animal.categoryName || animal.category_name)) {
      return animal.categoryName || animal.category_name;
    }

    if (typeof c === "string") return c;
    if (typeof c === "number") return "";
    if (typeof c === "object") return c.name || c.label || "";

    return "";
  }

  const filteredAnimals = animals.filter((animal) => {
    const statusUpper = String(animal.status || "").toUpperCase();

    const isPublicAnimal =
      statusUpper === "AVAILABLE" || statusUpper === "APPROVED";

    if (!isPublicAnimal) return false;

    const name = (animal.name || "").toString().toLowerCase();
    const loc = (animal.location || "").toString().toLowerCase();

    const query = search.toLowerCase().trim();
    const matchesSearch = !query || name.includes(query) || loc.includes(query);

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

    const ageNum =
      typeof animal.age === "number" ? animal.age : Number(animal.age) || 0;

    const a = filters.age;
    const matchesAge =
      !a ||
      (a === "0-2" && ageNum <= 2) ||
      (a === "3-6" && ageNum >= 3 && ageNum <= 6) ||
      (a === "7+" && ageNum >= 7);

    const lf = (filters.location || "").toLowerCase().trim();
    const matchesLocation = !lf || loc.includes(lf);

    const matchesSize =
      !filters.size || String(animal.size || "") === String(filters.size);

    const matchesStatus =
      !filters.status ||
      String(animal.status || "").toUpperCase() ===
        String(filters.status || "").toUpperCase();

    return (
      matchesSearch &&
      matchesCategory &&
      matchesAge &&
      matchesLocation &&
      matchesSize &&
      matchesStatus
    );
  });

  function resetAdoptDialog() {
    setAdoptOpen(false);
    setRequestMsg("");
    setSubmittingRequest(false);
  }

  async function handleAdoptSubmit() {
    if (!user?.accessToken) {
      setSnackSeverity("error");
      setSnackMsg("Please log in before sending an adoption request.");
      setSnackOpen(true);
      return;
    }

    if (!selectedAnimal?.id) {
      setSnackSeverity("error");
      setSnackMsg("Missing animal information.");
      setSnackOpen(true);
      return;
    }

    try {
      setSubmittingRequest(true);

      await RequestsApi.create({
        animalId: selectedAnimal.id,
        message: requestMsg || ""
      });

      setSnackSeverity("success");
      setSnackMsg("Request sent successfully.");
      setSnackOpen(true);

      setOpenDetails(false);
      setRequestMsg("");
      setAdoptOpen(false);
    } catch (err) {
      console.error("Request create failed:", err);

      const detail =
        err?.body?.message ||
        err?.body ||
        err?.message ||
        "Failed to send request";

      setSnackSeverity("error");
      setSnackMsg(String(detail));
      setSnackOpen(true);
    } finally {
      setSubmittingRequest(false);
    }
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ maxWidth: 1100, mx: "auto", mb: 4 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {username
              ? `Welcome to Pet Adoption, ${username} 🐾`
              : "Welcome to Pet Adoption 🐾"}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Here you can find animals that looking for a new home and start the adoption process
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.5,
          mb: 3,
          maxWidth: 1100,
          mx: "auto",
          flexWrap: "wrap"
        }}
      >
        <TextField
          placeholder="Search by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={loading}
          sx={{
            flex: 1,
            minWidth: { xs: "100%", sm: 320, md: 500 },
            maxWidth: 700,
            "& .MuiInputBase-root": {
              height: 54,
              fontSize: 16,
              borderRadius: 3
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />

        <IconButton
          color="primary"
          onClick={() => setFilterOpen(true)}
          disabled={loading}
          sx={{
            width: 48,
            height: 48,
            borderRadius: 3
          }}
        >
          <FilterListIcon />
        </IconButton>

        {isLoggedIn && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenAdd(true)}
            sx={{
              height: 48,
              borderRadius: 999,
              px: 3,
              fontWeight: 800,
              boxShadow: 4,
              whiteSpace: "nowrap"
            }}
          >
            Add Animal
          </Button>
        )}
      </Box>

      <FilterDialog
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        categories={categories}
        onApply={() => setFilterOpen(false)}
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

            if (created) {
              const statusUpper = String(created.status || "").toUpperCase();

              if (statusUpper === "AVAILABLE" || statusUpper === "APPROVED") {
                setAnimals((prev) => [created, ...prev]);
              }
            }

            setSnackSeverity("success");
            setSnackMsg("Your listing was submitted and is waiting for admin approval.");
            setSnackOpen(true);
          }}
        />
      </AnimalFormDialog>

      <Box
        sx={(theme) => ({
          ...scrollbarStyle(theme),
          maxWidth: 1180,
          mx: "auto",
          mt: 1,
          maxHeight: "62vh",
          overflowY: "auto",
          overflowX: "hidden",
          px: 1,
          pb: 2
        })}
      >
        {loading ? (
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">Error: {error}</Typography>
        ) : (
          <Grid container spacing={2} justifyContent="center" alignItems="stretch">
            {filteredAnimals.length > 0 ? (
              filteredAnimals.map((animal) => (
                <Grid item key={animal.id} xs={12} sm={6} md={4} lg={3}>
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
      </Box>

      <AnimalDetailsDialog open={openDetails} onClose={() => setOpenDetails(false)}>
        <AnimalDetailsContent
          animal={selectedAnimal}
          currentUserId={user?.id || user?.userId}
          onAdopt={(animal) => {
            if (!user?.accessToken) {
              setSnackSeverity("error");
              setSnackMsg("Please log in before sending an adoption request.");
              setSnackOpen(true);
              return;
            }

            setSelectedAnimal(animal);
            setRequestMsg("");
            setAdoptOpen(true);
          }}
        />
      </AnimalDetailsDialog>

      <Dialog
        open={adoptOpen}
        onClose={() => {
          if (!submittingRequest) {
            resetAdoptDialog();
          }
        }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            width: 420,
            maxWidth: "calc(100vw - 32px)"
          }
        }}
      >
        <DialogTitle>
          Request adoption for {selectedAnimal?.name}
        </DialogTitle>

        <DialogContent sx={{ minWidth: 340, pt: 2 }}>
          <TextField
            label="Message (optional)"
            multiline
            rows={4}
            fullWidth
            value={requestMsg}
            onChange={(e) => setRequestMsg(e.target.value)}
            disabled={submittingRequest}
            InputLabelProps={{ shrink: true }}
            sx={{
              mt: 1,
              "& .MuiInputBase-root": {
                alignItems: "flex-start"
              },
              "& .MuiOutlinedInput-input": {
                padding: "14px"
              },
              "& .MuiOutlinedInput-inputMultiline": {
                padding: 0,
                lineHeight: 1.5
              }
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={resetAdoptDialog} disabled={submittingRequest}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleAdoptSubmit}
            disabled={submittingRequest}
          >
            {submittingRequest ? "Sending..." : "Send request"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackOpen}
        autoHideDuration={3500}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity={snackSeverity}
          sx={{ width: "100%" }}
        >
          {snackMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default HomePage;
