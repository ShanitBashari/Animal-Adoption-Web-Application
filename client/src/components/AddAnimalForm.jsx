import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  InputAdornment,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import PetsIcon from "@mui/icons-material/Pets";
import ImageIcon from "@mui/icons-material/Image";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";

import { AnimalsApi, CategoriesApi } from "../api/api";
import LocationAutocomplete from "../components/LocationNominatimAutocomplete";
import { scrollbarStyle } from "../styles/scrollbar";

export default function AddAnimalForm({
  mode = "add",
  initialValues,
  setExternalLoading,
  onSuccess
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  /**
   * Styles for select dropdown menus.
   * Uses the shared scrollbar style and adapts colors to the current theme.
   */
  const menuProps = useMemo(() => {
    return {
      PaperProps: {
        sx: {
          ...scrollbarStyle(theme),
          maxHeight: 280,
          overflowY: "auto",
          bgcolor: "background.paper",
          color: "text.primary",
          border: `1px solid ${alpha(theme.palette.text.primary, isDark ? 0.12 : 0.10)}`,
          mt: 1,
          backdropFilter: "blur(6px)",
          "& .MuiMenuItem-root": {
            borderRadius: 2,
            mx: 1,
            my: 0.5,
            transition: "0.15s"
          },
          "& .MuiMenuItem-root:hover": {
            bgcolor: alpha(theme.palette.primary.main, isDark ? 0.14 : 0.10)
          },
          "& .Mui-selected": {
            bgcolor: `${alpha(theme.palette.primary.main, isDark ? 0.30 : 0.18)} !important`,
            color: "text.primary"
          },
          "& .Mui-selected:hover": {
            bgcolor: `${alpha(theme.palette.primary.main, isDark ? 0.38 : 0.24)} !important`
          }
        }
      }
    };
  }, [theme, isDark]);

  /**
   * Default form values used for creating a new animal listing.
   */
  const empty = {
    name: "",
    category: "",
    gender: "",
    size: "",
    location: "",
    description: "",
    ownerName: "",
    ownerPhone: "",
    age: "",
    status: "PENDING",
    image: null
  };

  const [form, setForm] = useState(() => ({
    ...empty,
    ...(initialValues || {})
  }));

  const [preview, setPreview] = useState(null);

  const [snack, setSnack] = useState({
    open: false,
    severity: "success",
    message: ""
  });

  const [submitting, setSubmitting] = useState(false);

  const [categories, setCategories] = useState([]);
  const [catsLoading, setCatsLoading] = useState(true);

  const isEdit = mode === "edit";
  const entityId = initialValues?.id;

  /**
   * Re-initializes the form when initialValues change.
   * This is useful when the same dialog is reused for editing different animals.
   */
  useEffect(() => {
    setForm({ ...empty, ...(initialValues || {}) });
  }, [initialValues]);

  /**
   * Loads active categories for the category select field.
   */
  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      setCatsLoading(true);

      try {
        const data = await CategoriesApi.listActive();

        if (mounted) {
          setCategories(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load categories", err);

        if (mounted) {
          setSnack({
            open: true,
            severity: "error",
            message: "Failed to load categories"
          });
        }
      } finally {
        if (mounted) setCatsLoading(false);
      }
    }

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  /**
   * Cleans up the object URL used for image preview
   * to avoid memory leaks when the preview changes or component unmounts.
   */
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  /**
   * Validates the age field.
   * Age can be:
   * - an empty string while typing
   * - null when marked as unknown
   * - an integer between 0 and 50
   */
  const isAgeValid =
    form.age === "" ||
    form.age === null ||
    (Number.isInteger(form.age) && form.age >= 0 && form.age <= 50);

  /**
   * Checks whether all required fields are filled correctly.
   */
  const isFormValid =
    String(form.name || "").trim().length > 0 &&
    String(form.category || "").trim().length > 0 &&
    String(form.gender || "").trim().length > 0 &&
    String(form.size || "").trim().length > 0 &&
    String(form.location || "").trim().length > 0 &&
    String(form.ownerName || "").trim().length > 0 &&
    String(form.ownerPhone || "").trim().length > 0 &&
    String(form.age || "").trim().length > 0 &&
    isAgeValid;

  /**
   * Opens a snackbar with the given severity and message.
   */
  const showSnack = (severity, message) =>
    setSnack({ open: true, severity, message });

  /**
   * Handles both create and edit submission flows.
   * If an image is selected, multipart API is used.
   * Otherwise, regular JSON create/update API is used.
   */
  async function handleSubmit(e) {
    e?.preventDefault?.();

    if (!isFormValid) {
      showSnack("warning", "Please fill all required fields");
      return;
    }

    if (isEdit && !entityId) {
      showSnack("error", "Missing animal id for edit");
      return;
    }

    setSubmitting(true);
    setExternalLoading?.(true);

    try {
      const bodyObj = {
        name: String(form.name || "").trim(),
        category: String(form.category || "").trim(),
        gender: String(form.gender || "").trim(),
        size: String(form.size || "").trim(),
        age: form.age === "" ? null : form.age,
        status: isEdit ? (form.status || "PENDING") : "PENDING",
        location: String(form.location || "").trim(),
        description: String(form.description || "").trim(),
        ownerName: String(form.ownerName || "").trim(),
        ownerPhone: String(form.ownerPhone || "").trim()
      };

      let saved;

      if (form.image) {
        const fd = new FormData();
        fd.append("body", JSON.stringify(bodyObj));
        fd.append("image", form.image);

        saved = isEdit
          ? await AnimalsApi.updateMultipart(entityId, fd)
          : await AnimalsApi.createMultipart(fd);
      } else {
        saved = isEdit
          ? await AnimalsApi.update(entityId, bodyObj)
          : await AnimalsApi.create(bodyObj);
      }

      showSnack(
        "success",
        isEdit
          ? "Animal updated successfully!"
          : "Animal submitted successfully and is waiting for admin approval."
      );

      onSuccess?.(saved);
    } catch (err) {
      console.error("Create/Update failed:", err);

      const msg =
        err?.body?.message ||
        (typeof err?.body === "string" && err.body.trim().length ? err.body : null) ||
        err?.message ||
        "Request failed";

      showSnack("error", msg);
    } finally {
      setSubmitting(false);
      setExternalLoading?.(false);
    }
  }

  return (
    <Card
      sx={{
        p: 4,
        borderRadius: 6,
        bgcolor: "background.paper",
        color: "text.primary",
        border: `1px solid ${alpha(theme.palette.text.primary, isDark ? 0.10 : 0.08)}`
      }}
    >
      <Box
        component="form"
        id="animal-form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      >
        <TextField
          fullWidth
          required
          label="Animal Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PetsIcon />
              </InputAdornment>
            )
          }}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            select
            required
            label="Category"
            value={form.category || ""}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            SelectProps={{ MenuProps: menuProps }}
            sx={{ flex: 1 }}
          >
            {catsLoading && (
              <MenuItem value="">
                <em>Loading...</em>
              </MenuItem>
            )}

            {!catsLoading && categories.length === 0 && (
              <MenuItem value="">
                <em>No categories</em>
              </MenuItem>
            )}

            {categories.map((c) => (
              <MenuItem key={c.id ?? c.name} value={c.name}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          <LocationAutocomplete
            value={form.location}
            onChange={(val) => setForm({ ...form, location: val || "" })}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            select
            fullWidth
            required
            label="Gender"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            SelectProps={{ MenuProps: menuProps }}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </TextField>

          <TextField
            select
            fullWidth
            required
            label="Size"
            value={form.size}
            onChange={(e) => setForm({ ...form, size: e.target.value })}
            SelectProps={{ MenuProps: menuProps }}
          >
            <MenuItem value="Small">Small</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Large">Large</MenuItem>
          </TextField>
        </Box>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            type="number"
            required
            label="Age"
            value={form.age === null ? "" : form.age}
            onChange={(e) => {
              const raw = e.target.value;

              if (raw === "") return setForm({ ...form, age: "" });

              let n = parseInt(raw, 10);

              if (Number.isNaN(n)) return setForm({ ...form, age: "" });

              // Keep age within the allowed range.
              if (n < 0) n = 0;
              if (n > 50) n = 50;

              setForm({ ...form, age: n });
            }}
            disabled={form.age === null}
            fullWidth
            inputProps={{ min: 0, max: 50, step: 1 }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={form.age === null}
                onChange={(e) => {
                  if (e.target.checked) {
                    setForm({ ...form, age: null });
                  } else {
                    setForm({ ...form, age: "" });
                  }
                }}
              />
            }
            label="Unknown"
          />
        </Box>

        <Button
          component="label"
          variant="outlined"
          startIcon={<ImageIcon />}
          fullWidth
          disabled={submitting}
        >
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                if (preview) URL.revokeObjectURL(preview);

                setForm({ ...form, image: file });
                setPreview(URL.createObjectURL(file));
              }
            }}
          />
        </Button>

        {preview && (
          <Box sx={{ textAlign: "center" }}>
            <img
              src={preview}
              alt="preview"
              style={{ width: 120, borderRadius: 8, marginTop: 8 }}
            />
          </Box>
        )}

        <TextField
          fullWidth
          multiline
          rows={2}
          label="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          sx={{
            "& .MuiInputBase-root": {
              ...scrollbarStyle(theme)
            },
            "& textarea": {
              ...scrollbarStyle(theme)
            }
          }}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            fullWidth
            required
            label="Owner Name"
            value={form.ownerName}
            onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              )
            }}
          />

          <TextField
            fullWidth
            required
            label="Owner Phone"
            value={form.ownerPhone}
            onChange={(e) => setForm({ ...form, ownerPhone: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon />
                </InputAdornment>
              )
            }}
          />
        </Box>

        <Box sx={{ display: "none" }}>
          <Button type="submit" />
        </Box>
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={2200}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snack.severity}
          variant="filled"
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          sx={{ borderRadius: 2 }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}