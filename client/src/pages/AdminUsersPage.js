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
import PetsIcon from "@mui/icons-material/Pets";

import { useNavigate } from "react-router-dom";
import { animals } from "./mockData";
import DeleteIcon from "@mui/icons-material/Delete";

function AdminUsersPage() {
  const navigate = useNavigate();

  // 🔹 MOCK USERS
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "User"
    },
    {
      id: 2,
      name: "Admin User",
      email: "admin@example.com",
      role: "Admin"
    },
    {
      id: 3,
      name: "Sarah Green",
      email: "sarah@example.com",
      role: "User"
    }
  ];

  const [openDelete, setOpenDelete] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);

  // 🔹 MOCK: count animals per user
  const animalsPerUser = (userId) =>
    animals.filter((_, index) => index % users.length === userId - 1).length;

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
            Users Management
          </Typography>

          <Typography
            variant="body1"
            sx={{ color: "white", opacity: 0.9 }}
          >
            View registered users and their activity within the system.
          </Typography>
        </Box>

        {/* USERS TABLE */}
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
            <TableRow>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Role</b></TableCell>
                <TableCell><b>Animals Published</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
            </TableRow>
            </TableHead>

            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>

                  <TableCell>
                    <Chip
                      label={user.role}
                      color={user.role === "Admin" ? "primary" : "default"}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    {animalsPerUser(user.id)}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label="Active"
                      color="success"
                      size="small"
                    />
                  </TableCell>
                    <TableCell align="center">
                        <IconButton
                            color="error"
                            onClick={() => {
                            setSelectedUser(user);
                            setOpenDelete(true);
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        PaperProps={{
            sx: {
            backgroundColor: "#1e1e2f",
            color: "white",
            borderRadius: 3,
            minWidth: 400
            }
        }}
        >
            <DialogTitle sx={{ color: "#ff6b6b", fontWeight: "bold" }}>
                Delete User
            </DialogTitle>

            <DialogContent>
                <DialogContentText
                sx={{
                    color: "rgba(255,255,255,0.85)",
                    mt: 1
                }}
                >
                Are you sure you want to permanently delete{" "}
                <b>{selectedUser?.name}</b>?
                <br /><br />
                This action will remove the user and <b>all associated animals</b>
                from the system and cannot be undone.
                </DialogContentText>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button
                onClick={() => setOpenDelete(false)}
                sx={{ color: "#b7edfc" }}
                >
                Cancel
                </Button>

                <Button
                color="error"
                variant="contained"
                onClick={() => {
                    // MOCK delete
                    setOpenDelete(false);
                    setSelectedUser(null);
                }}
                >
                Delete User
                </Button>
            </DialogActions>
        </Dialog>

    </>
  );
}

export default AdminUsersPage;
