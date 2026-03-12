import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  CircularProgress
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { scrollbarStyle } from "../styles/scrollbar";

/**
 * Reusable dialog wrapper for add/edit forms.
 * Supports both direct button handlers and form submission by formId.
 */
export default function AnimalFormDialog({
  open,
  onClose,
  title = "",
  children,
  formId,

  primaryText = "Save",
  secondaryText = "Cancel",
  onPrimary,
  onSecondary,

  loading = false,
  disablePrimary = false,
  disableSecondary = false,

  maxWidth = "sm",
  fullWidth = true
}) {
  /**
   * Handles the secondary action button.
   * Falls back to onClose when no custom handler is provided.
   */
  const handleSecondary = () => {
    if (loading) return;

    if (onSecondary) onSecondary();
    else onClose?.();
  };

  /**
   * Supports two submit modes:
   * - submit a real form by formId
   * - call a custom click handler directly
   */
  const primaryProps =
    formId
      ? { type: "submit", form: formId }
      : { onClick: onPrimary };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
    >
      <DialogTitle sx={{ pr: 6 }}>
        {title}

        <IconButton
          onClick={loading ? undefined : onClose}
          sx={{ position: "absolute", right: 10, top: 10 }}
          disabled={loading}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={(theme) => ({
          p: 0,
          maxHeight: "85vh",
          overflow: "auto",
          ...scrollbarStyle(theme)
        })}
      >
        {children}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={handleSecondary}
          disabled={loading || disableSecondary}
        >
          {secondaryText}
        </Button>

        <Button
          variant="contained"
          disabled={loading || disablePrimary}
          {...primaryProps}
        >
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
            {loading && <CircularProgress size={18} />}
            {primaryText}
          </Box>
        </Button>
      </DialogActions>
    </Dialog>
  );
}