import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import { AuthProvider } from "./auth/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { ColorModeProvider } from "./theme/ColorModeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <AuthProvider>
          <ColorModeProvider>
            <App />
          </ColorModeProvider>
        </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>

);
