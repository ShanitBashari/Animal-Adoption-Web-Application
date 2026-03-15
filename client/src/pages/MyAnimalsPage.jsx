import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Container,
  CircularProgress,
  Button,
  Chip
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PetsIcon from "@mui/icons-material/Pets";
import RestoreIcon from "@mui/icons-material/Restore";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
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

function MyAnimalsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [myAnimals, setMyAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openDetails, setOpenDetails] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);
  const editSubmitRef = React.useRef(null);
  const [editLoading, setEditLoading] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [activatingId, setActivatingId] = useState(null);

  /**
   * Loads the current user's animal listings.
   * Redirects to login if the user is not authenticated.
   */
  useEffect(() => {
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

        if (mounted) {
          setMyAnimals(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load mine:", err);

        const msg =
          err?.body?.message ||
          err?.body ||
          err?.message ||
          "Failed to load";

        if (mounted) {
          setError(
            typeof msg === "string"
              ? msg
              : JSON.stringify(msg).slice(0, 200)
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadMine();

    return () => {
      mounted = false;
    };
  }, [user?.accessToken, navigate]);

  /**
   * Deletes the selected listing after user confirmation.
   * After deletion, the page reloads the latest data from the server.
   */
  async function handleDeleteConfirmed() {
    if (!pendingDelete?.id) return;

    try {
      setDeleteLoading(true);

      await AnimalsApi.delete(pendingDelete.id);

      const fresh = await AnimalsApi.mine();
      setMyAnimals(Array.isArray(fresh) ? fresh : []);

      setOpenDelete(false);
      setPendingDelete(null);
    } catch (err) {
      console.error("Delete failed:", err);

      const msg =
        err?.body?.message ||
        err?.body ||
        err?.message ||
        "Delete failed";

      alert(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setDeleteLoading(false);
    }
  }

  /**
   * Reactivates an inactive listing and updates it locally in the UI.
   */
  async function handleActivate(animalId) {
    try {
      setActivatingId(animalId);

      const updated = await AnimalsApi.activate(animalId);

      setMyAnimals((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a))
      );
    } catch (err) {
      console.error("Activate failed:", err);

      const msg =
        err?.body?.message ||
        err?.body ||
        err?.message ||
        "Activate failed";

      alert(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setActivatingId(null);
    }
  }

  /**
   * Returns a visual label and style object for each listing status.
   * This is used to render the status chip on top of the animal card.
   */
  function getStatusMeta(status) {
    const s = String(status || "").toUpperCase();

    switch (s) {
      case "PENDING":
        return {
          label: "PENDING",
          sx: {
            bgcolor: "#fff3e0",
            color: "#ef6c00",
            border: "1px solid #ffb74d"
          }
        };

      case "REJECTED":
        return {
          label: "REJECTED",
          sx: {
            bgcolor: "#ffebee",
            color: "#c62828",
            border: "1px solid #ef9a9a"
          }
        };

      case "INACTIVE":
        return {
          label: "INACTIVE",
          sx: {
            bgcolor: "#eceff1",
            color: "#455a64",
            border: "1px solid #b0bec5"
          }
        };

      case "AVAILABLE":
      case "APPROVED":
        return {
          label: "ACTIVE",
          sx: {
            bgcolor: "#e8f5e9",
            color: "#2e7d32",
            border: "1px solid #81c784"
          }
        };

      default:
        return {
          label: s || "UNKNOWN",
          sx: {
            bgcolor: "#f5f5f5",
            color: "#616161",
            border: "1px solid #e0e0e0"
          }
        };
    }
  }

  return (
    <>
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
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            sx={(theme) => {
              const isDark = theme.palette.mode === "dark";
              const accent = isDark ? theme.palette.primary.light : theme.palette.primary.main;

              return {
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
            My Animals <PetsIcon />
          </Typography>

          <Typography
            sx={(theme) => ({
              mt: 1,
              fontWeight: 700,
              color: alpha(theme.palette.text.primary, 0.75)
            })}
          >
            Manage the animals you’ve listed for adoption - view, edit, or remove your posts.
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ textAlign: "center", mt: 4 }}>
            {error}
          </Typography>
        ) : myAnimals.length === 0 ? (
          <Typography sx={{ textAlign: "center", mt: 4 }}>
            You don’t have any listings yet.
          </Typography>
        ) : (
          <Grid container spacing={2} justifyContent="center">
            {myAnimals.map((animal) => {
              const statusUpper = String(animal.status || "").toUpperCase();
              const isInactive = statusUpper === "INACTIVE";
              const isPending = statusUpper === "PENDING";
              const isAdopted = statusUpper === "ADOPTED";
              const isActivating = activatingId === animal.id;
              const statusMeta = getStatusMeta(statusUpper);

              return (
                <Grid item key={animal.id} xs={12} sm={6} md={4} lg={3}>
                  <Box sx={{ position: "relative", display: "flex", justifyContent: "center" }}>
                    <AnimalCard
                      animal={animal}
                      onClick={(a) => {
                        setSelectedAnimal(a);
                        setOpenDetails(true);
                      }}
                    />

                    <Chip
                      label={statusMeta.label}
                      size="small"
                      icon={isInactive ? <PauseCircleOutlineIcon /> : undefined}
                      sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        fontWeight: 800,
                        ...statusMeta.sx
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      mt: 1.2,
                      display: "flex",
                      justifyContent: "center",
                      gap: 1
                    }}
                  >
                    <IconButton
                      onClick={() => {
                        setSelectedAnimal(animal);
                        setOpenDetails(true);
                      }}
                      sx={{
                        bgcolor: "#687680",
                        border: "1px solid #90caf9"
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>

                    {isInactive ? (
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<RestoreIcon />}
                        disabled={isActivating}
                        onClick={() => handleActivate(animal.id)}
                        sx={{
                          borderRadius: 999,
                          textTransform: "none",
                          fontWeight: 800
                        }}
                      >
                        {isActivating ? "Activating..." : "Activate"}
                      </Button>
                    ) : isPending ? (
                      <Button
                        size="small"
                        variant="outlined"
                        disabled
                        sx={{
                          borderRadius: 999,
                          textTransform: "none",
                          fontWeight: 800
                        }}
                      >
                        Waiting for approval
                      </Button>
                    ) : isAdopted ? (
                      <Button
                        size="small"
                        variant="outlined"
                        disabled
                        sx={{
                          borderRadius: 999,
                          textTransform: "none",
                          fontWeight: 800
                        }}
                      >
                        Already Adopted
                      </Button>
                    ) : (
                      <>
                        <IconButton
                          onClick={() => {
                            setEditingAnimal(animal);
                            setOpenEdit(true);
                          }}
                          sx={{
                            bgcolor: "#ebb866",
                            border: "1px solid #ffcc80"
                          }}
                        >
                          <EditIcon />
                        </IconButton>

                        <IconButton
                          onClick={() => {
                            setPendingDelete(animal);
                            setOpenDelete(true);
                          }}
                          sx={{
                            bgcolor: "#df5d71",
                            border: "1px solid #ef9a9a"
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}

                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>

      <AnimalDetailsDialog open={openDetails} onClose={() => setOpenDetails(false)}>
        <AnimalDetailsContent animal={selectedAnimal} hideAdopt />
      </AnimalDetailsDialog>

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

            // Update only the edited item in the local list.
            if (updated) {
              setMyAnimals((prev) =>
                prev.map((a) => (a.id === updated.id ? updated : a))
              );
            }
          }}
        />
      </AnimalFormDialog>

      <ConfirmDialog
        open={openDelete}
        title="Remove listing?"
        description={`Are you sure you want to remove "${pendingDelete?.name}" from adoption?`}
        confirmText={deleteLoading ? "Removing..." : "Remove"}
        cancelText="Cancel"
        onClose={() => (deleteLoading ? null : setOpenDelete(false))}
        onConfirm={handleDeleteConfirmed}
        disableConfirm={deleteLoading}
        disableCancel={deleteLoading}
      />
    </>
  );
}

export default MyAnimalsPage;