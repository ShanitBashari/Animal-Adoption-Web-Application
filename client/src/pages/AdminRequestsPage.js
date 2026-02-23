import React from "react";
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
  Button
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { useNavigate } from "react-router-dom";

function AdminRequestsPage() {
  const navigate = useNavigate();

  const [selectedRequest, setSelectedRequest] = React.useState(null);
  const [actionType, setActionType] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);

  // 🔹 MOCK REQUESTS
  const requests = [
    {
      id: 1,
      animalName: "Max",
      requester: "John Doe",
      date: "2024-06-10",
      status: "Pending"
    },
    {
      id: 2,
      animalName: "Luna",
      requester: "Sarah Green",
      date: "2024-06-11",
      status: "Pending"
    }
  ];

  const handleAction = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setOpenDialog(true);
  };

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
          transition: "0.2s",
          "&:hover": {
            opacity: 1,
            transform: "translateX(-4px)"
          }
        }}
      >
        <ArrowBackIcon />
        <Typography variant="body2">Back to Dashboard</Typography>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 6 }}>
        {/* TITLE */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            sx={{ color: "#b7edfc", fontWeight: "bold", mb: 1 }}
          >
            Adoption Requests
          </Typography>

          <Typography sx={{ color: "white", opacity: 0.9 }}>
            Review and manage adoption requests submitted by users.
          </Typography>
        </Box>

        {/* TABLE */}
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Animal</b></TableCell>
                <TableCell><b>Requested By</b></TableCell>
                <TableCell><b>Date</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id} hover>
                  <TableCell>{request.animalName}</TableCell>
                  <TableCell>{request.requester}</TableCell>
                  <TableCell>{request.date}</TableCell>

                  <TableCell>
                    <Chip
                      label={request.status}
                      color="warning"
                      size="small"
                    />
                  </TableCell>

                  <TableCell align="center">
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* CONFIRM DIALOG */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#1e1e2f",
            color: "white",
            borderRadius: 3
          }
        }}
      >
        <DialogTitle
          sx={{
            color: actionType === "approve" ? "#4caf50" : "#ff6b6b",
            fontWeight: "bold"
          }}
        >
          {actionType === "approve"
            ? "Approve Adoption Request"
            : "Reject Adoption Request"}
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ color: "rgba(255,255,255,0.85)" }}>
            Are you sure you want to{" "}
            <b>{actionType}</b> the adoption request for{" "}
            <b>{selectedRequest?.animalName}</b>
            <br /><br />
            Requested by: <b>{selectedRequest?.requester}</b>
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{ color: "#b7edfc" }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color={actionType === "approve" ? "success" : "error"}
            onClick={() => {
              // MOCK ACTION
              setOpenDialog(false);
              setSelectedRequest(null);
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AdminRequestsPage;
