import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  MenuItem
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { scrollbarStyle } from "../styles/scrollbar";

/**
 * Reusable dialog for filtering animals on the home page.
 * The selected filter values are controlled by the parent component.
 */
export default function FilterDialog({
  open,
  onClose,
  filters,
  setFilters,
  categories = [],
  onApply,
  onClear
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  /**
   * Shared styling for select dropdown menus.
   * Uses theme-aware colors and the shared custom scrollbar.
   */
  const menuProps = useMemo(() => {
    return {
      PaperProps: {
        sx: {
          ...scrollbarStyle(theme),
          bgcolor: "background.paper",
          color: "text.primary",
          border: `1px solid ${alpha(theme.palette.text.primary, isDark ? 0.12 : 0.10)}`,
          mt: 1,
          "& .MuiMenuItem-root": { borderRadius: 2, mx: 1, my: 0.5 },
          "& .MuiMenuItem-root:hover": {
            bgcolor: alpha(theme.palette.primary.main, isDark ? 0.14 : 0.10)
          },
          "& .Mui-selected": {
            bgcolor: `${alpha(theme.palette.primary.main, isDark ? 0.28 : 0.18)} !important`
          }
        }
      }
    };
  }, [theme, isDark]);

  /**
   * Theme-aware dialog surface styling.
   */
  const paperSx = {
    bgcolor: "background.paper",
    color: "text.primary",
    borderRadius: 3,
    border: `1px solid ${alpha(theme.palette.text.primary, isDark ? 0.12 : 0.08)}`,
    boxShadow: isDark ? "0 20px 60px rgba(0,0,0,0.6)" : "0 20px 60px rgba(0,0,0,0.18)"
  };

  /**
   * Shared field background styling used across all filter inputs.
   */
  const fieldSx = {
    "& .MuiInputBase-root": {
      bgcolor: alpha(theme.palette.text.primary, isDark ? 0.06 : 0.03)
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{ sx: paperSx }}
    >
      <DialogContent sx={{ p: 3, position: "relative" }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "text.primary",
            bgcolor: alpha(theme.palette.common.black, isDark ? 0.20 : 0.06),
            "&:hover": {
              bgcolor: alpha(theme.palette.common.black, isDark ? 0.30 : 0.10)
            }
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
          Filter Animals
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            select
            label="Category"
            value={filters.category || ""}
            onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}
            SelectProps={{ MenuProps: menuProps }}
            sx={fieldSx}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.id ?? c.name} value={c.id ?? c.name}>
                {c.name ?? c}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Age"
            value={filters.age || ""}
            onChange={(e) => setFilters((p) => ({ ...p, age: e.target.value }))}
            SelectProps={{ MenuProps: menuProps }}
            sx={fieldSx}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="0-2">0-2</MenuItem>
            <MenuItem value="3-6">3-6</MenuItem>
            <MenuItem value="7+">7+</MenuItem>
          </TextField>

          <TextField
            label="Location (contains)"
            value={filters.location || ""}
            onChange={(e) => setFilters((p) => ({ ...p, location: e.target.value }))}
            sx={fieldSx}
          />

          <TextField
            select
            label="Size"
            value={filters.size || ""}
            onChange={(e) => setFilters((p) => ({ ...p, size: e.target.value }))}
            SelectProps={{ MenuProps: menuProps }}
            sx={fieldSx}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Small">Small</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Large">Large</MenuItem>
          </TextField>

          <TextField
            select
            label="Status"
            value={filters.status || ""}
            onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
            SelectProps={{ MenuProps: menuProps }}
            sx={fieldSx}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="AVAILABLE">AVAILABLE</MenuItem>
            <MenuItem value="PENDING">PENDING</MenuItem>
            <MenuItem value="ADOPTED">ADOPTED</MenuItem>
          </TextField>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}>
            <Button variant="text" onClick={onClear} sx={{ fontWeight: 800 }}>
              Clear
            </Button>

            <Button variant="contained" onClick={onApply} sx={{ fontWeight: 900 }}>
              Apply
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}