import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { AuthProvider } from "./auth/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { ColorModeProvider } from "./theme/ColorModeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
      <CssBaseline />
        <AuthProvider>
          <ColorModeProvider>
            <App />
          </ColorModeProvider>
        </AuthProvider>
  </BrowserRouter>

);
