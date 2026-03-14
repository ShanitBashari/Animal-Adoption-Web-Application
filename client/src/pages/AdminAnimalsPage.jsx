import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  TextField
} from "@mui/material";

import { alpha } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useNavigate } from "react-router-dom";
import { AdminApi } from "../api/api";
import { useAuth } from "../auth/AuthContext";
import AnimalDetailsDialog from "../components/AnimalDetailsDialog";
import AnimalDetailsContent from "../components/AnimalDetailsContent";
import { scrollbarStyle } from "../styles/scrollbar";

function AdminAnimalsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);

  const [actionType, setActionType] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = (user?.roles || []).includes("ADMIN");

  useEffect(() => {
    if (!isAdmin) return;

    let mounted = true;

    async function loadAnimals() {
      try {
        setLoading(true);
        setError("");

        const data = await AdminApi.animals();

        if (mounted) {
          setAnimals(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load admin animals:", err);

        const msg =
          err?.body?.message ||
          err?.body ||
          err?.message ||
          "Failed to load animals";

        if (mounted) {
          setError(typeof msg === "string" ? msg : JSON.stringify(msg).slice(0, 200));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAnimals();

    return () => {
      mounted = false;
    };
  }, [isAdmin]);

  function getStatusMeta(status) {
    const s = String(status || "").toUpperCase();

    switch (s) {
      case "AVAILABLE":
      case "APPROVED":
        return {
          label: "Approved",
          color: "success",
          icon: <CheckCircleIcon sx={{ fontSize: 16 }} />
        };
      case "REJECTED":
        return {
          label: "Rejected",
          color: "error",
          icon: <CancelIcon sx={{ fontSize: 16 }} />
        };
      case "PENDING":
      default:
        return {
          label: "Pending",
          color: "warning",
          icon: <HourglassTopIcon sx={{ fontSize: 16 }} />
        };
    }
  }

  function handleAction(animal, type) {
    setSelectedAnimal(animal);
    setActionType(type);
    setRejectReason("");
    setOpenDialog(true);
  }

  function closeDialog() {
    if (submitting) return;
    setOpenDialog(false);
    setActionType("");
    setRejectReason("");
  }

  async function handleConfirm() {
    if (!selectedAnimal?.id) return;

    try {
      setSubmitting(true);

      let updated;

      if (actionType === "approve") {
        updated = await AdminApi.approveAnimal(selectedAnimal.id);
      } else {
        updated = await AdminApi.rejectAnimal(selectedAnimal.id, rejectReason);
      }

      setAnimals((prev) =>
        prev.map((animal) => (animal.id === updated.id ? updated : animal))
      );

      closeDialog();
    } catch (err) {
      console.error("Animal action failed:", err);

      const msg =
        err?.body?.message ||
        err?.body ||
        err?.message ||
        "Failed to update animal";

      alert(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setSubmitting(false);
    }
  }

  if (!isAdmin) {
    return (
      <Typography sx={{ textAlign: "center", mt: 10 }}>
        Access Denied
      </Typography>
    );
  }

  return (
    <>
      <Box
        onClick={() => navigate("/admin")}
        sx={(theme) => {
          const accent =
            theme.palette.mode === "dark"
              ? theme.palette.primary.light
              : theme.palette.primary.main;

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
            bgcolor: alpha(accent, theme.palette.mode === "dark" ? 0.08 : 0.06),
            border: `1px solid ${alpha(accent, theme.palette.mode === "dark" ? 0.22 : 0.18)}`,
            backdropFilter: "blur(8px)",
            "&:hover": {
              opacity: 1,
              transform: "translateX(-4px)",
              bgcolor: alpha(accent, theme.palette.mode === "dark" ? 0.14 : 0.10)
            }
          };
        }}
      >
        <ArrowBackIcon fontSize="small" />
        <Typography variant="body2">Back to Dashboard</Typography>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            sx={(theme) => ({
              fontWeight: 900,
              mb: 1,
              color: "transparent",
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(90deg,#b7edfc,#7dd3fc)"
                  : `linear-gradient(90deg,${theme.palette.primary.dark},${theme.palette.primary.main})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            })}
          >
            Animal Approval Queue
          </Typography>

          <Typography
            sx={(theme) => ({
              color: alpha(
                theme.palette.text.primary,
                theme.palette.mode === "dark" ? 0.86 : 0.78
              ),
              fontWeight: 700
            })}
          >
            Review and manage newly submitted animal listings.
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
        ) : animals.length === 0 ? (
          <Typography sx={{ textAlign: "center", mt: 4, fontWeight: 700 }}>
            No animal listings found.
          </Typography>
        ) : (
          <TableContainer
            component={Paper}
            sx={(theme) => ({
              borderRadius: 3,
              overflow: "hidden",
              border: `1px solid ${alpha(theme.palette.divider, 0.16)}`
            })}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={(theme) => ({
                    bgcolor: alpha(
                      theme.palette.primary.main,
                      theme.palette.mode === "dark" ? 0.10 : 0.06
                    )
                  })}
                >
                  <TableCell><b>Animal</b></TableCell>
                  <TableCell><b>Owner</b></TableCell>
                  <TableCell><b>Location</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell><b>Description</b></TableCell>
                  <TableCell align="center"><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {animals.map((animal) => {
                  const statusMeta = getStatusMeta(animal.status);
                  const isPending =
                    String(animal.status || "").toUpperCase() === "PENDING";

                  return (
                    <TableRow key={animal.id} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => {
                              setSelectedAnimal(animal);
                              setOpenDetails(true);
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>

                          <Typography fontWeight={700}>
                            {animal.name || `Animal #${animal.id}`}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>{animal.ownerName || "—"}</TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 280,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}
                        >
                          {animal.location || "—"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={statusMeta.label}
                          color={statusMeta.color}
                          size="small"
                          icon={statusMeta.icon}
                          sx={{ fontWeight: 800 }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 260,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}
                        >
                          {animal.description || "—"}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        {isPending ? (
                          <>
                            <IconButton
                              color="success"
                              onClick={() => handleAction(animal, "approve")}
                            >
                              <CheckCircleIcon />
                            </IconButton>

                            <IconButton
                              color="error"
                              onClick={() => handleAction(animal, "reject")}
                            >
                              <CancelIcon />
                            </IconButton>
                          </>
                        ) : (
                          <Typography variant="body2" sx={{ opacity: 0.6 }}>
                            —
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>

      <Dialog
        open={openDialog}
        onClose={closeDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 380
          }
        }}
      >
        <DialogTitle
          sx={{
            color: actionType === "approve" ? "success.main" : "error.main",
            fontWeight: 900
          }}
        >
          {actionType === "approve"
            ? "Approve Animal Listing"
            : "Reject Animal Listing"}
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ color: "text.primary", mb: 2 }}>
            Are you sure you want to <b>{actionType}</b> the listing for{" "}
            <b>{selectedAnimal?.name}</b>?
            <br />
            <br />
            Owner: <b>{selectedAnimal?.ownerName || "—"}</b>
          </DialogContentText>

          {actionType === "reject" && (
            <TextField
              fullWidth
              label="Reason (optional)"
              multiline
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDialog} disabled={submitting}>
            Cancel
          </Button>

          <Button
            variant="contained"
            color={actionType === "approve" ? "success" : "error"}
            onClick={handleConfirm}
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      <AnimalDetailsDialog
        open={openDetails}
        onClose={() => setOpenDetails(false)}
      >
        <AnimalDetailsContent animal={selectedAnimal} hideAdopt />
      </AnimalDetailsDialog>
    </>
  );
}

export default AdminAnimalsPage;
