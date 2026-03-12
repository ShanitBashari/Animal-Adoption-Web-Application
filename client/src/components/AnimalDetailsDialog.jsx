import { Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

/**
 * Reusable dialog container for displaying animal details content.
 * It handles dialog sizing, backdrop styling and the close button.
 */
export default function AnimalDetailsDialog({ open, onClose, children }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={false}
      PaperProps={{
        sx: {
          width: "min(1200px, calc(100vw - 64px))",
          borderRadius: 2,
          bgcolor: "#1f2430",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
          overflow: "hidden",
          position: "relative"
        }
      }}
      BackdropProps={{
        sx: { bgcolor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }
      }}
    >
      <IconButton
        onClick={onClose}
        sx={(theme) => ({
          position: "absolute",
          top: 12,
          right: 12,
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(0,0,0,0.55)"
              : "rgba(255,255,255,0.9)",
          color: theme.palette.text.primary,
          boxShadow: theme.shadows[3],
          backdropFilter: "blur(4px)",
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(0,0,0,0.75)"
                : "rgba(255,255,255,1)"
          }
        })}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ p: 0, maxHeight: "85vh", overflow: "auto" }}>
        {children}
      </DialogContent>
    </Dialog>
  );
}