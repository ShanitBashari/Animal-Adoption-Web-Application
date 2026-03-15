import { useEffect, useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
  CircularProgress,
  Link
} from "@mui/material";
import { useAuth } from "../auth/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [values, setValues] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const expired = params.get("expired");

    if (expired === "1") {
      setServerError("Your session has expired. Please log in again.");
    }
  }, [location.search]);
  /**
   * Updates form state when user types in an input field.
   * Also clears previous validation and server errors.
   */
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  /**
   * Performs simple client-side validation before submitting.
   * Returns true if the form is valid.
   */
  const validate = () => {
    const temp = {};

    if (!values.username.trim())
      temp.username = "Username is required";

    if (!values.password)
      temp.password = "Password is required";

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };


  /**
   * Converts API error responses into user-friendly messages.
   */
  const toFriendlyMessage = (err) => {
    const status = err?.status;

    if (status === 401) return "Invalid username or password";
    if (status === 403) return "You are not allowed to login";
    if (status === 400) return err?.message || "Invalid input";
    if (status === 500) return "Server error. Please try again.";

    return err?.message || "Login failed";
  };


  /**
   * Handles form submission:
   * 1. validates inputs
   * 2. calls login API
   * 3. redirects to home on success
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    setServerError("");

    try {
      await login(values.username.trim(), values.password);

      const params = new URLSearchParams(location.search);
      const redirect = params.get("redirect") || "/";

      navigate(redirect, { replace: true });
    } catch (err) {
      setServerError(toFriendlyMessage(err));
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <Box
      sx={{
        minHeight: "calc(100dvh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: { xs: 4, sm: 6 }
      }}
    >

      <Container maxWidth="sm">

        <Paper
          elevation={8}
          sx={{
            width: "100%",
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: { xs: 3, sm: 4 },
            textAlign: "center"
          }}
        >

          <Typography variant="h4" gutterBottom>
            Login
          </Typography>

          {serverError && (
            <Alert severity="error" sx={{ mb: 2, textAlign: "left" }}>
              {serverError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>

            <TextField
              fullWidth
              label="Username"
              name="username"
              margin="normal"
              value={values.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              disabled={submitting}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              margin="normal"
              value={values.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              disabled={submitting}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              type="submit"
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={18} /> : null}
            >
              {submitting ? "Logging in..." : "Login"}
            </Button>

            <Typography sx={{ mt: 2 }}>
              Don’t have an account?{" "}
              <Link
                component={RouterLink}
                to="/register"
                underline="hover"
                color="primary"
                sx={{ fontWeight: 700 }}
              >
                Register
              </Link>
            </Typography>

          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default LoginPage;