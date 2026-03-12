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
  CircularProgress
} from "@mui/material";

import { alpha } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";

import { useNavigate } from "react-router-dom";
import { AdminApi } from "../api/api";
import { useAuth } from "../auth/AuthContext";

function AdminUsersPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = (user?.roles || []).includes("ADMIN");

  /**
   * Loads both users and animals so the page can display
   * how many listings each user has published.
   */
  useEffect(() => {
    if (!isAdmin) return;

    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [usersData, animalsData] = await Promise.all([
          AdminApi.users(),
          AdminApi.animals()
        ]);

        if (mounted) {
          setUsers(Array.isArray(usersData) ? usersData : []);
          setAnimals(Array.isArray(animalsData) ? animalsData : []);
        }
      } catch (err) {
        console.error("Failed to load users page:", err);

        const msg =
          err?.body?.message ||
          err?.body ||
          err?.message ||
          "Failed to load users";

        if (mounted) {
          setError(typeof msg === "string" ? msg : JSON.stringify(msg).slice(0, 200));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [isAdmin]);

  /**
   * Counts how many animals belong to a specific user.
   */
  function animalsPerUser(userId) {
    return animals.filter((a) => String(a.ownerUserId) === String(userId)).length;
  }

  /**
   * Converts role arrays into a simple label for display.
   */
  function getRoleLabel(u) {
    const roles = Array.isArray(u?.roles) ? u.roles : [];
    if (roles.includes("ADMIN")) return "Admin";
    return "User";
  }

  /**
   * Opens the confirmation dialog for activate/deactivate actions.
   */
  function openActionDialog(targetUser, type) {
    setSelectedUser(targetUser);
    setActionType(type);
    setOpenDialog(true);
  }

  /**
   * Closes the confirmation dialog unless a request is in progress.
   */
  function closeDialog() {
    if (submitting) return;
    setOpenDialog(false);
    setSelectedUser(null);
    setActionType("");
  }

  /**
   * Applies the selected user action and updates the changed user locally.
   */
  async function handleConfirm() {
    if (!selectedUser?.id) return;

    try {
      setSubmitting(true);

      let updated;

      if (actionType === "deactivate") {
        updated = await AdminApi.deactivateUser(selectedUser.id);
      } else {
        updated = await AdminApi.activateUser(selectedUser.id);
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === updated.id ? updated : u))
      );

      closeDialog();
    } catch (err) {
      console.error("User action failed:", err);

      const msg =
        err?.body?.message ||
        err?.body ||
        err?.message ||
        "Failed to update user";

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
        <ArrowBackIcon />
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
            Users Management
          </Typography>

          <Typography
            variant="body1"
            sx={(theme) => ({
              color: alpha(theme.palette.text.primary, theme.palette.mode === "dark" ? 0.86 : 0.78),
              fontWeight: 700
            })}
          >
            View registered users and manage their access within the system.
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
        ) : users.length === 0 ? (
          <Typography sx={{ textAlign: "center", mt: 4, fontWeight: 700 }}>
            No users found.
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
                    bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.10 : 0.06)
                  })}
                >
                  <TableCell><b>Name</b></TableCell>
                  <TableCell><b>Email</b></TableCell>
                  <TableCell><b>Role</b></TableCell>
                  <TableCell><b>Animals Published</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell align="center"><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {users.map((u) => {
                  const roleLabel = getRoleLabel(u);
                  const isEnabled = !!u.enabled;
                  const isCurrentAdmin = String(u.id) === String(user?.id || user?.userId);

                  return (
                    <TableRow key={u.id} hover>
                      <TableCell>{u.username || "—"}</TableCell>
                      <TableCell>{u.email || "—"}</TableCell>

                      <TableCell>
                        <Chip
                          label={roleLabel}
                          color={roleLabel === "Admin" ? "primary" : "default"}
                          size="small"
                          sx={{ fontWeight: 800 }}
                        />
                      </TableCell>

                      <TableCell>{animalsPerUser(u.id)}</TableCell>

                      <TableCell>
                        <Chip
                          label={isEnabled ? "Active" : "Inactive"}
                          color={isEnabled ? "success" : "warning"}
                          size="small"
                          sx={{ fontWeight: 800 }}
                        />
                      </TableCell>

                      <TableCell align="center">
                        {isCurrentAdmin ? (
                          <Typography variant="body2" sx={{ opacity: 0.6 }}>
                            —
                          </Typography>
                        ) : isEnabled ? (
                          <IconButton
                            color="warning"
                            onClick={() => openActionDialog(u, "deactivate")}
                          >
                            <ToggleOffIcon />
                          </IconButton>
                        ) : (
                          <IconButton
                            color="success"
                            onClick={() => openActionDialog(u, "activate")}
                          >
                            <CheckCircleIcon />
                          </IconButton>
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
            minWidth: 400
          }
        }}
      >
        <DialogTitle
          sx={{
            color: actionType === "deactivate" ? "warning.main" : "success.main",
            fontWeight: 900
          }}
        >
          {actionType === "deactivate" ? "Deactivate User" : "Activate User"}
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ color: "text.primary", mt: 1 }}>
            {actionType === "deactivate" ? (
              <>
                Are you sure you want to deactivate <b>{selectedUser?.username}</b>?
                <br /><br />
                The user will no longer be able to access the system.
              </>
            ) : (
              <>
                Are you sure you want to activate <b>{selectedUser?.username}</b>?
                <br /><br />
                The user will regain access to the system.
              </>
            )}
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeDialog}>Cancel</Button>

          <Button
            variant="contained"
            color={actionType === "deactivate" ? "warning" : "success"}
            onClick={handleConfirm}
            disabled={submitting}
            startIcon={actionType === "deactivate" ? <BlockIcon /> : <CheckCircleIcon />}
          >
            {submitting
              ? "Saving..."
              : actionType === "deactivate"
                ? "Deactivate"
                : "Activate"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AdminUsersPage;