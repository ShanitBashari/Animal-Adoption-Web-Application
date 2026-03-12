import React, { createContext, useContext, useMemo, useState } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { scrollbarStyle } from "../styles/scrollbar";

const ColorModeContext = createContext(null);

export function ColorModeProvider({ children }) {
  /**
   * Initializes theme mode from localStorage
   * so the user's preference persists across refreshes.
   */
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("mui-mode") || "light";
  });

  /**
   * Exposes theme mode actions to the rest of the app.
   */
  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((prev) => {
          const next = prev === "light" ? "dark" : "light";
          localStorage.setItem("mui-mode", next);
          return next;
        });
      },
      setMode: (m) => {
        localStorage.setItem("mui-mode", m);
        setMode(m);
      }
    }),
    [mode]
  );

  /**
   * Builds the MUI theme and applies the shared custom scrollbar globally.
   */
  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode },
        components: {
          MuiCssBaseline: {
            styleOverrides: (themeParam) => ({
              html: {
                ...scrollbarStyle(themeParam)
              },
              body: {
                ...scrollbarStyle(themeParam),
                margin: 0,
                padding: 0
              }
            })
          }
        }
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

/**
 * Convenience hook for accessing theme mode state and actions.
 */
export function useColorMode() {
  return useContext(ColorModeContext);
}