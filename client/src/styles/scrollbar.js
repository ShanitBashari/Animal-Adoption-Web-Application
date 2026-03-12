export const scrollbarStyle = (theme) => {
  const isDark = theme.palette.mode === "dark";

  const thumb = isDark
    ? "rgba(125, 211, 252, 0.35)"
    : "rgba(25, 118, 210, 0.30)";

  const thumbHover = isDark
    ? "rgba(125, 211, 252, 0.55)"
    : "rgba(25, 118, 210, 0.50)";

  const track = isDark
    ? "rgba(255,255,255,0.04)"
    : "rgba(0,0,0,0.04)";

  return {
    scrollbarWidth: "thin",
    scrollbarColor: `${thumb} ${track}`,
    scrollbarGutter: "stable",

    "&::-webkit-scrollbar": {
      width: 8,
      height: 8
    },

    "&::-webkit-scrollbar-track": {
      background: track,
      borderRadius: 999
    },

    "&::-webkit-scrollbar-thumb": {
      background: thumb,
      borderRadius: 999,
      border: "2px solid transparent",
      backgroundClip: "padding-box"
    },

    "&::-webkit-scrollbar-thumb:hover": {
      background: thumbHover
    }
  };
};