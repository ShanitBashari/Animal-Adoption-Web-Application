import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, IconButton, Container, CircularProgress } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PetsIcon from "@mui/icons-material/Pets";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import AnimalDetailsDialog from "../components/AnimalDetailsDialog";
import AnimalDetailsContent from "../components/AnimalDetailsContent";
import AnimalFormDialog from "../components/AnimalFormDialog";
import AddAnimalForm from "../components/AddAnimalForm";
import ConfirmDialog from "../components/ConfirmDialog";
import AnimalCard from "../components/AnimalCard";

import { AnimalsApi } from "../api/api";
import { useAuth } from "../auth/AuthContext";


function MyListingsPage() {
 const navigate = useNavigate();
  const { user } = useAuth();

  const [myAnimals, setMyAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // view
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  // edit
  const [openEdit, setOpenEdit] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);
  const editSubmitRef = React.useRef(null);
  const [editLoading, setEditLoading] = useState(false);

  // delete
  const [openDelete, setOpenDelete] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    // must be logged in (because /mine requires JWT)
    if (!user?.accessToken) {
      navigate("/login");
      return;
    }

    let mounted = true;

    async function loadMine() {
      try {
        setLoading(true);
        setError("");
        const data = await AnimalsApi.mine();
        if (mounted) setMyAnimals(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load mine:", err);
        const msg = err?.body?.message || err?.body || err?.message || "Failed to load";
        if (mounted) setError(typeof msg === "string" ? msg : JSON.stringify(msg).slice(0, 200));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadMine();
    return () => (mounted = false);
  }, [user?.accessToken, navigate]);

  async function handleDeleteConfirmed() {
    if (!pendingDelete?.id) return;

    try {
      setDeleteLoading(true);
      await AnimalsApi.delete(pendingDelete.id);
      setMyAnimals((prev) => prev.filter((a) => a.id !== pendingDelete.id));
      setOpenDelete(false);
      setPendingDelete(null);
    } catch (err) {
      console.error("Delete failed:", err);
      const msg = err?.body?.message || err?.body || err?.message || "Delete failed";
      alert(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <>
      {/* Back */}
      <Box
        onClick={() => navigate("/")}
        sx={(theme) => {
          const isDark = theme.palette.mode === "dark";
          const accent = isDark ? theme.palette.primary.light : theme.palette.primary.main;

          return {
            position: "fixed",
            top: 90,
            left: 24,
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            color: accent,
            fontWeight: 800,
            opacity: 0.92,
            transition: "0.2s",
            zIndex: 10,
            px: 1.2,
            py: 0.7,
            borderRadius: 999,
            bgcolor: alpha(accent, isDark ? 0.08 : 0.06),
            border: `1px solid ${alpha(accent, isDark ? 0.22 : 0.18)}`,
            backdropFilter: "blur(8px)",
            "&:hover": {
              opacity: 1,
              transform: "translateX(-4px)",
              bgcolor: alpha(accent, isDark ? 0.14 : 0.10)
            }
          };
        }}
      >
        <ArrowBackIcon fontSize="small" />
        <Typography variant="body2" sx={{ fontWeight: 800 }}>
          Back to Home
        </Typography>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Box sx={{ textAlign: "center", mb: 4, px: 2 }}>
          <Typography
            variant="h3"
            sx={(theme) => {
              const isDark = theme.palette.mode === "dark";
              const accent = isDark ? theme.palette.primary.light : theme.palette.primary.main;

              return {
                textAlign: "center",
                mb: 1,
                fontWeight: 900,
                letterSpacing: "0.4px",
                color: "transparent",
                background: isDark
                  ? "linear-gradient(90deg,#b7edfc,#7dd3fc)"
                  : `linear-gradient(90deg,${theme.palette.primary.dark},${accent})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-flex",
                alignItems: "center",
                gap: 1
              };
            }}
          >
            My Listings <PetsIcon />
          </Typography>

          <Typography
            variant="body1"
            sx={(theme) => ({
              textAlign: "center",
              mb: 1,
              fontWeight: 800,
              color: alpha(theme.palette.text.primary, theme.palette.mode === "dark" ? 0.86 : 0.78)
            })}
          >
            Manage the animals you’ve listed for adoption — view, edit, or delete your posts.
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ textAlign: "center", mt: 4, fontWeight: 800 }}>
            {error}
          </Typography>
        ) : myAnimals.length === 0 ? (
          <Typography
            variant="body1"
            sx={(theme) => {
              const isDark = theme.palette.mode === "dark";

              return {
                textAlign: "center",
                mt: 2,
                fontWeight: 900,
                color: isDark ? theme.palette.primary.light : theme.palette.primary.dark,
                opacity: 0.98
              };
            }}
          >
            You don’t have any listings yet.
          </Typography>
        ) : (
          <Grid container spacing={1.25} justifyContent="center">
            {myAnimals.map((animal) => (
              <Grid item key={animal.id} xs={12} sm={6} md={4} lg={2}>
                <AnimalCard
                  animal={animal}
                  onClick={(a) => {
                    setSelectedAnimal(a);
                    setOpenDetails(true);
                  }}
                />

                {/* actions */}
                <Box
                  sx={(theme) => ({
                    width: 250,
                    mt: 1.2,
                    display: "flex",
                    justifyContent: "center",
                    gap: 1.5
                  })}
                >
                  {/* View */}
                  <IconButton
                    aria-label="view"
                    onClick={() => {
                      setSelectedAnimal(animal);
                      setOpenDetails(true);
                    }}
                    sx={(theme) => {
                      const isDark = theme.palette.mode === "dark";
                      const c = isDark ? theme.palette.primary.light : theme.palette.primary.main;
                      return {
                        bgcolor: alpha(c, isDark ? 0.10 : 0.08),
                        color: c,
                        border: `1px solid ${alpha(c, isDark ? 0.22 : 0.18)}`,
                        "&:hover": { bgcolor: alpha(c, isDark ? 0.18 : 0.14) }
                      };
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>

                  {/* Edit */}
                  <IconButton
                    aria-label="edit"
                    onClick={() => {
                      setEditingAnimal(animal);
                      setOpenEdit(true);
                    }}
                    sx={(theme) => {
                      const isDark = theme.palette.mode === "dark";
                      const c = theme.palette.warning.main;
                      return {
                        bgcolor: alpha(c, isDark ? 0.12 : 0.10),
                        color: isDark ? theme.palette.warning.light : theme.palette.warning.dark,
                        border: `1px solid ${alpha(c, isDark ? 0.24 : 0.20)}`,
                        "&:hover": { bgcolor: alpha(c, isDark ? 0.20 : 0.16) }
                      };
                    }}
                  >
                    <EditIcon />
                  </IconButton>

                  {/* Delete */}
                  <IconButton
                    aria-label="delete"
                    onClick={() => {
                      setPendingDelete(animal);
                      setOpenDelete(true);
                    }}
                    sx={(theme) => {
                      const isDark = theme.palette.mode === "dark";
                      const c = theme.palette.error.main;
                      return {
                        bgcolor: alpha(c, isDark ? 0.12 : 0.10),
                        color: isDark ? theme.palette.error.light : theme.palette.error.dark,
                        border: `1px solid ${alpha(c, isDark ? 0.24 : 0.20)}`,
                        "&:hover": { bgcolor: alpha(c, isDark ? 0.20 : 0.16) }
                      };
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Details (reuse Home) — no adopt */}
      <AnimalDetailsDialog open={openDetails} onClose={() => setOpenDetails(false)}>
        <AnimalDetailsContent animal={selectedAnimal} onAdopt={() => {}} hideAdopt />
      </AnimalDetailsDialog>

      {/* Edit */}
      <AnimalFormDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        title="Edit Listing"
        primaryText="Save"
        secondaryText="Cancel"
        formId="animal-form"
        onSecondary={() => {
          setOpenEdit(false);
          setEditingAnimal(null);
        }}
        onPrimary={() => editSubmitRef.current?.()}
        loading={editLoading}
      >
        <AddAnimalForm
          mode="edit"
          initialValues={editingAnimal}
          registerSubmit={(fn) => (editSubmitRef.current = fn)}
          setExternalLoading={setEditLoading}
          onSuccess={(updated) => {
            setOpenEdit(false);
            setEditingAnimal(null);
            if (updated)
              setMyAnimals((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
          }}
        />
      </AnimalFormDialog>

      {/* Delete confirm */}
      <ConfirmDialog
        open={openDelete}
        title="Delete listing?"
        description={`Are you sure you want to remove "${pendingDelete?.name} from adoption"?`}
        confirmText={deleteLoading ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        onClose={() => (deleteLoading ? null : setOpenDelete(false))}
        onConfirm={handleDeleteConfirmed}
        disableConfirm={deleteLoading}
        disableCancel={deleteLoading}
      />
    </>
  );
}

export default MyListingsPage;