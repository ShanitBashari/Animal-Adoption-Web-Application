import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#b7edfc",
    },
    background: {
      default: "#15151c",
      paper: "rgba(120, 131, 154, 0.33)",
    },
    text: {
      primary: "#ffffff",
    },
  },

  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#b7edfc #15151c", // Firefox
          "&::-webkit-scrollbar": {
            width: "10px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#15151c",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#b7edfc",
            borderRadius: "10px",
            border: "2px solid #15151c",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#8ad4f7",
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          textTransform: "uppercase",
        },
      },
    },
  },
});

export default theme;
