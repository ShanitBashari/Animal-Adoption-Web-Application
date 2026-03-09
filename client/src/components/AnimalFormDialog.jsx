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

export default function AnimalFormDialog({
  open,
  onClose,
  title = "",
  children,

  // ✅ חדש: מזהה טופס פנימי
  formId,

  // footer buttons
  primaryText = "Save",
  secondaryText = "Cancel",
  onPrimary,     // אופציונלי: אם רוצים פעולה אחרת
  onSecondary,

  loading = false,
  disablePrimary = false,
  disableSecondary = false,

  maxWidth = "sm",
  fullWidth = true
}) {
  const handleSecondary = () => {
    if (loading) return;
    if (onSecondary) onSecondary();
    else onClose?.();
  };

  const primaryProps =
    formId
      ? { type: "submit", form: formId } // ✅ זה עושה submit אמיתי גם אם הכפתור מחוץ ל-form
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

      <DialogContent dividers>{children}</DialogContent>

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