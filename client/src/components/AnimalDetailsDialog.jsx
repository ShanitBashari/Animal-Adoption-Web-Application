import { Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 10,
          color: "rgba(255,255,255,0.9)",
          bgcolor: "rgba(255,255,255,0.08)",
          "&:hover": { bgcolor: "rgba(255,255,255,0.12)" }
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ p: 0, maxHeight: "85vh", overflow: "auto" }}>
        {children}
      </DialogContent>
    </Dialog>
  );
}