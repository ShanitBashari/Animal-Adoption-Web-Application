import React, { useEffect, useMemo, useState } from "react";
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
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  CircularProgress,
  Container,
  Chip
} from "@mui/material";

import { alpha, useTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RestoreIcon from "@mui/icons-material/Restore";
import CategoryIcon from "@mui/icons-material/Category";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";

import { useNavigate } from "react-router-dom";
import { CategoriesApi } from "../api/api";
import { useAuth } from "../auth/AuthContext";
import { scrollbarStyle } from "../styles/scrollbar";

function AdminCategoriesPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();

  const isAdmin = (user?.roles || []).includes("ADMIN");

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeactivateDialog, setOpenDeactivateDialog] = useState(false);
  const [openReactivateDialog, setOpenReactivateDialog] = useState(false);

  const [categoryName, setCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  /**
   * Counts currently active categories for the summary chips.
   */
  const activeCount = useMemo(
    () => categories.filter((c) => c.active).length,
    [categories]
  );

  /**
   * Loads all categories for admin management.
   */
  useEffect(() => {
    if (!isAdmin) return;

    let mounted = true;

    async function loadCategories() {
      try {
        setLoading(true);
        setError("");

        const data = await CategoriesApi.adminList();

        if (mounted) {
          setCategories(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);

        const msg =
          err?.body?.message ||
          err?.body ||
          err?.message ||
          "Failed to load categories";

        if (mounted) {
          setError(typeof msg === "string" ? msg : JSON.stringify(msg).slice(0, 200));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadCategories();

    return () => {
      mounted = false;
    };
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <Typography sx={{ textAlign: "center", mt: 10 }}>
        Access Denied
      </Typography>
    );
  }

  /**
   * Returns a new list sorted alphabetically by category name.
   */
  function sortByName(list) {
    return [...list].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }

  /**
   * Opens the add-category dialog with a clean input state.
   */
  function openAddCategoryDialog() {
    setCategoryName("");
    setOpenAddDialog(true);
  }

  /**
   * Closes the add dialog unless a request is in progress.
   */
  function closeAddDialog() {
    if (submitting) return;
    setOpenAddDialog(false);
    setCategoryName("");
  }

  /**
   * Creates a new category and inserts it into the local list in sorted order.
   */
  async function handleAddCategory() {
    const trimmed = categoryName.trim();
    if (!trimmed) return;

    try {
      setSubmitting(true);

      const created = await CategoriesApi.create({
        name: trimmed
      });

      setCategories((prev) => {
        const withoutSameId = prev.filter((c) => String(c.id) !== String(created.id));
        return sortByName([...withoutSameId, created]);
      });

      closeAddDialog();
    } catch (err) {
      console.error("Failed to add category:", err);

      const msg =
        err?.body?.message ||
        err?.body ||
        err?.message ||
        "Failed to add category";

      alert(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setSubmitting(false);
    }
  }

  function openDeactivateCategoryDialog(category) {
    setSelectedCategory(category);
    setOpenDeactivateDialog(true);
  }

  function closeDeactivateDialog() {
    if (submitting) return;
    setOpenDeactivateDialog(false);
    setSelectedCategory(null);
  }

  /**
   * Deactivates a category and updates only the changed item locally.
   */
  async function handleDeactivateCategory() {
    if (!selectedCategory?.id) return;

    try {
      setSubmitting(true);

      const updated = await CategoriesApi.deactivate(selectedCategory.id);

      setCategories((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );

      closeDeactivateDialog();
    } catch (err) {
      console.error("Failed to deactivate category:", err);

      const msg =
        err?.body?.message ||
        err?.body ||
        err?.message ||
        "Failed to deactivate category";

      alert(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setSubmitting(false);
    }
  }

  function openReactivateCategoryDialog(category) {
    setSelectedCategory(category);
    setOpenReactivateDialog(true);
  }

  function closeReactivateDialog() {
    if (submitting) return;
    setOpenReactivateDialog(false);
    setSelectedCategory(null);
  }

  /**
   * Reactivates a category and updates only the changed item locally.
   */
  async function handleReactivateCategory() {
    if (!selectedCategory?.id) return;

    try {
      setSubmitting(true);

      const updated = await CategoriesApi.reactivate(selectedCategory.id);

      setCategories((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );

      closeReactivateDialog();
    } catch (err) {
      console.error("Failed to reactivate category:", err);

      const msg =
        err?.body?.message ||
        err?.body ||
        err?.message ||
        "Failed to reactivate category";

      alert(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setSubmitting(false);
    }
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
          <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
            <CategoryIcon
              sx={{
                fontSize: 40,
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.light
                    : theme.palette.primary.main
              }}
            />
          </Box>

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
            Categories Management
          </Typography>

          <Typography
            variant="body1"
            sx={(theme) => ({
              color: alpha(theme.palette.text.primary, theme.palette.mode === "dark" ? 0.86 : 0.78),
              fontWeight: 700
            })}
          >
            Add, deactivate, and reactivate categories for the platform.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
            mb: 3
          }}
        >
          <Box sx={{ display: "flex", gap: 1.2, flexWrap: "wrap" }}>
            <Chip
              icon={<CheckCircleIcon />}
              label={`Active: ${activeCount}`}
              color="success"
              sx={{ fontWeight: 800 }}
            />
            <Chip
              icon={<BlockIcon />}
              label={`Inactive: ${categories.length - activeCount}`}
              color="warning"
              sx={{ fontWeight: 800 }}
            />
            <Chip
              icon={<CategoryIcon />}
              label={`Total: ${categories.length}`}
              color="primary"
              sx={{ fontWeight: 800 }}
            />
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openAddCategoryDialog}
            sx={{ borderRadius: 999, fontWeight: 800, px: 2.5 }}
          >
            Add Category
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ textAlign: "center", mt: 4 }}>
            {error}
          </Typography>
        ) : categories.length === 0 ? (
          <Typography sx={{ textAlign: "center", mt: 4, fontWeight: 700 }}>
            No categories found.
          </Typography>
        ) : (
          <TableContainer
            component={Paper}
            sx={(theme) => {
              const isDark = theme.palette.mode === "dark";

              return {
                ...scrollbarStyle(theme),
                maxHeight: "60vh",
                borderRadius: 3,
                overflow: "auto",
                border: `1px solid ${alpha(theme.palette.divider, 0.16)}`,
                backgroundColor: theme.palette.background.paper,
                boxShadow: isDark
                  ? `0 8px 28px ${alpha(theme.palette.common.black, 0.22)}`
                  : `0 8px 28px ${alpha(theme.palette.common.black, 0.08)}`,
                backdropFilter: "blur(6px)",
                transition: "all 0.2s ease"
              };
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={(theme) => ({
                      bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.1 : 0.06),
                      fontWeight: 800
                    })}
                  >
                    <b>Name</b>
                  </TableCell>

                  <TableCell
                    sx={(theme) => ({
                      bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.1 : 0.06),
                      fontWeight: 800
                    })}
                  >
                    <b>Status</b>
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={(theme) => ({
                      bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.1 : 0.06),
                      fontWeight: 800
                    })}
                  >
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {cat.name || "—"}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={cat.active ? "Active" : "Inactive"}
                        color={cat.active ? "success" : "warning"}
                        size="small"
                        sx={{ fontWeight: 800 }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      {cat.active ? (
                        <IconButton
                          color="warning"
                          onClick={() => openDeactivateCategoryDialog(cat)}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          color="success"
                          onClick={() => openReactivateCategoryDialog(cat)}
                        >
                          <RestoreIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>

      <Dialog
        open={openAddDialog}
        onClose={closeAddDialog}
        PaperProps={{ sx: { borderRadius: 3, minWidth: 420 } }}
      >
        <DialogTitle sx={{ fontWeight: 900 }}>
          Add Category
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Create a new category for animals in the system.
          </DialogContentText>

          <TextField
            label="Category Name"
            fullWidth
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            autoFocus
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeAddDialog} disabled={submitting}>
            Cancel
          </Button>

          <Button
            onClick={handleAddCategory}
            variant="contained"
            disabled={submitting || !categoryName.trim()}
          >
            {submitting ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeactivateDialog}
        onClose={closeDeactivateDialog}
        PaperProps={{ sx: { borderRadius: 3, minWidth: 420 } }}
      >
        <DialogTitle sx={{ color: "warning.main", fontWeight: 900 }}>
          Deactivate Category
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ color: "text.primary", mt: 1 }}>
            Are you sure you want to deactivate <b>{selectedCategory?.name}</b>?
            <br /><br />
            It will no longer appear for new selections, but animals already using it will still show it.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeDeactivateDialog} disabled={submitting}>
            Cancel
          </Button>

          <Button
            variant="contained"
            color="warning"
            onClick={handleDeactivateCategory}
            disabled={submitting}
            startIcon={<BlockIcon />}
          >
            {submitting ? "Saving..." : "Deactivate"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openReactivateDialog}
        onClose={closeReactivateDialog}
        PaperProps={{ sx: { borderRadius: 3, minWidth: 420 } }}
      >
        <DialogTitle sx={{ color: "success.main", fontWeight: 900 }}>
          Reactivate Category
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ color: "text.primary", mt: 1 }}>
            Are you sure you want to reactivate <b>{selectedCategory?.name}</b>?
            <br /><br />
            It will appear again for new selections.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeReactivateDialog} disabled={submitting}>
            Cancel
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={handleReactivateCategory}
            disabled={submitting}
            startIcon={<RestoreIcon />}
          >
            {submitting ? "Saving..." : "Reactivate"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AdminCategoriesPage;