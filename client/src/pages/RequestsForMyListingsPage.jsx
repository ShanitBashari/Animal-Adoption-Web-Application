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

import { alpha, useTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useNavigate } from "react-router-dom";
import { AnimalsApi, RequestsApi } from "../api/api";
import { useAuth } from "../auth/AuthContext";
import AnimalDetailsDialog from "../components/AnimalDetailsDialog";
import AnimalDetailsContent from "../components/AnimalDetailsContent";

function RequestsForMyListingsPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [openDetails, setOpenDetails] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  async function loadRequests() {
    try {
      setLoading(true);
      setError("");

      const data = await RequestsApi.received();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load received requests:", err);

      const msg =
        err?.body?.message ||
        err?.body ||
        err?.message ||
        "Failed to load received adoption requests";

      setError(typeof msg === "string" ? msg : JSON.stringify(msg).slice(0, 200));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user?.accessToken) {
      navigate("/login");
      return;
    }

    loadRequests();
  }, [user?.accessToken, navigate]);

  function handleAction(request, type) {
    setSelectedRequest(request);
    setActionType(type);
    setRejectReason("");
    setOpenDialog(true);
  }

  function closeDialog() {
    if (submitting) return;
    setOpenDialog(false);
    setSelectedRequest(null);
    setActionType("");
    setRejectReason("");
  }

  async function handleViewAnimal(request) {
    if (!request?.animalId) return;

    try {
      setDetailsLoading(true);
      const animal = await AnimalsApi.get(request.animalId);
      setSelectedAnimal(animal);
      setOpenDetails(true);
    } catch (err) {
      console.error("Failed to load animal details:", err);

      const msg =
        err?.body?.message ||
        err?.body ||
        err?.message ||
        "Failed to load animal details";

      alert(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setDetailsLoading(false);
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return "—";

    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;

    return d.toLocaleString();
  }

  function getStatusMeta(status) {
    const s = String(status || "").toUpperCase();

    switch (s) {
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
      case "CANCELED":
        return {
          label: "Canceled",
          color: "default",
          icon: <InfoOutlinedIcon sx={{ fontSize: 16 }} />
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

  async function handleConfirm() {
    if (!selectedRequest?.id) return;

    try {
      setSubmitting(true);

      if (actionType === "approve") {
        await RequestsApi.approve(selectedRequest.id);
      } else {
        await RequestsApi.reject(selectedRequest.id, rejectReason);
      }

      closeDialog();
      await loadRequests();
    } catch (err) {
      console.error("Request action failed:", err);

      const msg =
        err?.body?.message ||
        err?.body ||
        err?.message ||
        "Failed to update request";

      alert(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Box
        onClick={() => navigate("/")}
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
        <Typography variant="body2">Back to Home</Typography>
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
            Requests For My Animals
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
            Review and manage adoption requests received on the animals you posted.
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
        ) : requests.length === 0 ? (
          <Typography sx={{ textAlign: "center", mt: 4, fontWeight: 700 }}>
            No requests received yet.
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
                  <TableCell><b>Requested By</b></TableCell>
                  <TableCell><b>Date</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell><b>Message</b></TableCell>
                  <TableCell align="center"><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {requests.map((request) => {
                  const statusMeta = getStatusMeta(request.status);
                  const isPending =
                    String(request.status || "").toUpperCase() === "PENDING";

                  return (
                    <TableRow key={request.id} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleViewAnimal(request)}
                            disabled={detailsLoading}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>

                          <Typography fontWeight={700}>
                            {request.animalName || `Animal #${request.animalId}`}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        {request.userName || `User #${request.userId}`}
                      </TableCell>

                      <TableCell>{formatDate(request.createdAt)}</TableCell>

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
                          {request.message || "—"}
                        </Typography>

                        {String(request.status || "").toUpperCase() === "REJECTED" &&
                        request.reason ? (
                          <Typography
                            variant="caption"
                            sx={{ color: theme.palette.error.main, fontWeight: 700 }}
                          >
                            Reason: {request.reason}
                          </Typography>
                        ) : null}
                      </TableCell>

                      <TableCell align="center">
                        {isPending ? (
                          <>
                            <IconButton
                              color="success"
                              onClick={() => handleAction(request, "approve")}
                            >
                              <CheckCircleIcon />
                            </IconButton>

                            <IconButton
                              color="error"
                              onClick={() => handleAction(request, "reject")}
                            >
                              <CancelIcon />
                            </IconButton>
                          </>
                        ) : (
                          <Typography
                            variant="body2"
                            sx={{ opacity: 0.6 }}
                          >
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
            ? "Approve Adoption Request"
            : "Reject Adoption Request"}
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ color: "text.primary", mb: 2 }}>
            Are you sure you want to <b>{actionType}</b> the adoption request for{" "}
            <b>{selectedRequest?.animalName}</b>?
            <br />
            <br />
            Requested by: <b>{selectedRequest?.userName}</b>
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

export default RequestsForMyListingsPage;
