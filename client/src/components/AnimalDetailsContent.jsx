import { Box, Typography, Chip, Button, Divider } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import StraightenIcon from "@mui/icons-material/Straighten";
import WcIcon from "@mui/icons-material/Wc";
import CakeIcon from "@mui/icons-material/Cake";
import PetsIcon from "@mui/icons-material/Pets";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CancelIcon from "@mui/icons-material/Cancel";

export default function AnimalDetailsContent({
  animal,
  onAdopt,
  hideAdopt = false,
  currentUserId
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  if (!animal) return null;

  /**
   * Resolves the displayed image from one of the supported formats:
   * - empty / missing image -> fallback image
   * - base64 image
   * - full URL
   * - backend relative path
   */
  const raw = animal?.image || "";
  const API_BASE = process.env.REACT_APP_API_URL;

  const imageSrc =
    !raw || String(raw).trim() === ""
      ? "/no-image.png"
      : raw.startsWith("data:") || raw.startsWith("http")
        ? raw
        : `${API_BASE}${raw.startsWith("/") ? "" : "/"}${raw}`;

  /**
   * Normalizes category label from either an object or plain string.
   */
  const categoryLabel =
    typeof animal.category === "object"
      ? animal.category?.name || "Category"
      : animal.category || "Category";

  /**
   * Builds a friendly age label and handles missing age values.
   */
  const ageLabel =
    animal.age === null || animal.age === "" || typeof animal.age === "undefined"
      ? "Unknown age"
      : `Age: ${animal.age}`;

  const status = (animal.status || "AVAILABLE").toString().toUpperCase();
  const isInactive = status === "INACTIVE";

  /**
   * Tries multiple possible owner id fields because animal data
   * may come from different backend response shapes.
   */
  const ownerUserId =
    animal?.ownerUserId ??
    animal?.userId ??
    animal?.owner?.id ??
    null;

  /**
   * Determines whether the current user is viewing their own listing.
   * This is used to hide the adopt action and show the "Your listing" badge instead.
   */
  const isOwnListing =
    currentUserId != null &&
    ownerUserId != null &&
    String(currentUserId) === String(ownerUserId);

  /**
   * Returns label, icon and theme-aware colors for the current animal status.
   */
  const getStatusMeta = (s) => {
    switch (s) {
      case "AVAILABLE":
        return {
          label: "AVAILABLE",
          icon: <CheckCircleIcon fontSize="small" />,
          bg: alpha(theme.palette.success.main, isDark ? 0.18 : 0.14),
          border: alpha(theme.palette.success.main, isDark ? 0.35 : 0.3),
          text: isDark ? theme.palette.success.light : theme.palette.success.dark
        };

      case "PENDING":
        return {
          label: "PENDING",
          icon: <HourglassTopIcon fontSize="small" />,
          bg: alpha(theme.palette.warning.main, isDark ? 0.18 : 0.14),
          border: alpha(theme.palette.warning.main, isDark ? 0.35 : 0.3),
          text: isDark ? theme.palette.warning.light : theme.palette.warning.dark
        };

      case "ADOPTED":
        return {
          label: "ADOPTED",
          icon: <CancelIcon fontSize="small" />,
          bg: alpha(theme.palette.error.main, isDark ? 0.18 : 0.14),
          border: alpha(theme.palette.error.main, isDark ? 0.35 : 0.3),
          text: isDark ? theme.palette.error.light : theme.palette.error.dark
        };

      default:
        return {
          label: s || "UNKNOWN",
          icon: <InfoOutlinedIcon fontSize="small" />,
          bg: alpha(theme.palette.text.primary, isDark ? 0.1 : 0.06),
          border: alpha(theme.palette.text.primary, isDark ? 0.18 : 0.14),
          text: theme.palette.text.primary
        };
    }
  };

  const statusMeta = getStatusMeta(status);

  /**
   * Shared styles used across the details layout to keep the UI consistent.
   */
  const sectionTitleSx = {
    fontWeight: 900,
    letterSpacing: "0.6px",
    textTransform: "uppercase",
    fontSize: "0.78rem",
    mb: 1,
    display: "inline-flex",
    alignItems: "center",
    gap: 0.8,
    color: "transparent",
    background: isDark
      ? "linear-gradient(90deg,#b7edfc,#7dd3fc)"
      : "linear-gradient(90deg,#1976d2,#42a5f5)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  };

  const softBox = {
    bgcolor: alpha(theme.palette.text.primary, isDark ? 0.05 : 0.04),
    border: `1px solid ${alpha(theme.palette.text.primary, isDark ? 0.1 : 0.1)}`,
    borderRadius: 2.2
  };

  const chipBase = {
    bgcolor: alpha(theme.palette.text.primary, isDark ? 0.1 : 0.06),
    color: "text.primary",
    border: `1px solid ${alpha(theme.palette.text.primary, isDark ? 0.14 : 0.12)}`,
    fontWeight: 800
  };

  /**
   * Applies a soft themed color tint to icons in different sections.
   */
  const iconTint = (colorKey) => ({
    color: alpha(theme.palette[colorKey].main, isDark ? 0.95 : 0.85)
  });

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        p: { xs: 3, md: 4 },
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "360px 1fr" },
        gap: 4,
        alignItems: "start"
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 360,
          mx: { xs: "auto", md: 0 },
          p: 2,
          ...softBox
        }}
      >
        <Box
          sx={{
            width: "100%",
            aspectRatio: "1 / 1",
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: alpha(theme.palette.common.black, isDark ? 0.25 : 0.08)
          }}
        >
          <Box
            component="img"
            src={imageSrc}
            alt={animal.name || "Animal"}
            onError={(e) => {
              e.currentTarget.src = "/placeholder-animal.png";
            }}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
      </Box>

      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            alignItems: "flex-start",
            flexWrap: "wrap"
          }}
        >
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
              {animal.name}
            </Typography>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1.5 }}>
              <Chip
                size="small"
                icon={statusMeta.icon}
                label={statusMeta.label}
                sx={{
                  bgcolor: statusMeta.bg,
                  border: `1px solid ${statusMeta.border}`,
                  color: statusMeta.text,
                  fontWeight: 900,
                  "& .MuiChip-icon": { color: statusMeta.text }
                }}
              />

              <Chip size="small" label={ageLabel} sx={chipBase} />
              <Chip size="small" label={animal.size || "Unknown size"} sx={chipBase} />
              <Chip size="small" label={animal.gender || "Unknown gender"} sx={chipBase} />
              <Chip size="small" label={categoryLabel} sx={chipBase} />
            </Box>
          </Box>

          {!hideAdopt && !isOwnListing && (
            <Button
              variant="contained"
              color="success"
              onClick={() => onAdopt?.(animal)}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.2,
                fontWeight: 900,
                textTransform: "none",
                alignSelf: "flex-start",
                boxShadow: isDark ? 8 : 4,
                mt: 3
              }}
            >
              Adopt Now
            </Button>
          )}

          {!hideAdopt && isOwnListing && !isInactive && (
            <Chip
              label="Your listing"
              sx={{
                fontWeight: 900,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.info.main, isDark ? 0.18 : 0.12),
                color: isDark ? theme.palette.info.light : theme.palette.info.dark,
                border: `1px solid ${alpha(theme.palette.info.main, isDark ? 0.35 : 0.25)}`
              }}
            />
          )}
        </Box>

        <Divider sx={{ my: 3, opacity: isDark ? 0.18 : 0.35 }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2.5
          }}
        >
          <Box sx={{ p: 2.25, ...softBox }}>
            <Typography sx={sectionTitleSx}>
              <LocationOnIcon fontSize="small" sx={iconTint("info")} />
              Location
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocationOnIcon fontSize="small" sx={iconTint("info")} />
              <Typography sx={{ fontWeight: 800 }}>
                {animal.location || "—"}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ p: 2.25, ...softBox }}>
            <Typography sx={sectionTitleSx}>
              <PersonIcon fontSize="small" sx={iconTint("primary")} />
              Owner Details
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PersonIcon fontSize="small" sx={iconTint("primary")} />
                <Typography sx={{ fontWeight: 800 }}>
                  {animal.ownerName || "—"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhoneIcon fontSize="small" sx={iconTint("success")} />
                <Typography sx={{ fontWeight: 800 }}>
                  {animal.ownerPhone || "—"}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ p: 2.25, ...softBox }}>
            <Typography sx={sectionTitleSx}>
              <InfoOutlinedIcon fontSize="small" sx={iconTint("secondary")} />
              Attributes
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1.5
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CakeIcon fontSize="small" sx={iconTint("warning")} />
                <Typography sx={{ fontWeight: 800 }}>{ageLabel}</Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <WcIcon fontSize="small" sx={iconTint("secondary")} />
                <Typography sx={{ fontWeight: 800 }}>
                  {animal.gender || "Unknown gender"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <StraightenIcon fontSize="small" sx={iconTint("info")} />
                <Typography sx={{ fontWeight: 800 }}>
                  {animal.size || "Unknown size"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PetsIcon fontSize="small" sx={iconTint("success")} />
                <Typography sx={{ fontWeight: 800 }}>{categoryLabel}</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  gridColumn: "1 / -1",
                  mt: 0.25
                }}
              >
                <InfoOutlinedIcon fontSize="small" sx={{ color: statusMeta.text }} />
                <Typography sx={{ fontWeight: 900 }}>Status:</Typography>

                <Chip
                  size="small"
                  icon={statusMeta.icon}
                  label={statusMeta.label}
                  sx={{
                    ml: 0.5,
                    bgcolor: statusMeta.bg,
                    border: `1px solid ${statusMeta.border}`,
                    color: statusMeta.text,
                    fontWeight: 900,
                    "& .MuiChip-icon": { color: statusMeta.text }
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              gridColumn: { xs: "1 / -1" },
              p: 2.25,
              ...softBox
            }}
          >
            <Typography sx={sectionTitleSx}>
              <InfoOutlinedIcon fontSize="small" sx={iconTint("info")} />
              Description
            </Typography>

            <Typography sx={{ opacity: isDark ? 0.92 : 0.85, lineHeight: 1.65 }}>
              {animal.description || "No description."}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}