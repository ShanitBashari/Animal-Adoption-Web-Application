import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
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
import { AuthApi } from "../api/api";

function RegisterPage() {

  // React Router navigation
  const navigate = useNavigate();

  // form input values
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // validation errors per field
  const [errors, setErrors] = useState({});

  // error message returned from server
  const [serverError, setServerError] = useState("");

  // loading state during registration
  const [submitting, setSubmitting] = useState(false);


  /**
   * Updates form state when the user types.
   * Clears validation errors and server errors.
   */
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };


  /**
   * Performs client-side validation before sending request.
   * Checks username length, email format and password rules.
   */
  const validate = () => {

    const tempErrors = {};

    if (!values.username || values.username.trim().length < 3) {
      tempErrors.username = "Username must be at least 3 characters";
    }

    if (!values.email || !values.email.trim()) {
      tempErrors.email = "Email is required";
    } else {

      // simple email format validation
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim());

      if (!emailOk)
        tempErrors.email = "Email is invalid";
    }

    if (!values.password || values.password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters";
    }

    if (values.password !== values.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };


  /**
   * Handles registration form submission.
   * Sends request to API and redirects to login page if successful.
   */
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    setServerError("");

    try {

      await AuthApi.register({
        username: values.username.trim(),
        email: values.email.trim(),
        password: values.password
      });

      // redirect user to login page after successful registration
      navigate("/login", { replace: true });

    } catch (err) {

      setServerError(err?.message || "Register failed");

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
            Create Account
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
              label="Email"
              name="email"
              type="email"
              margin="normal"
              value={values.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
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

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              margin="normal"
              value={values.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
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
              {submitting ? "Registering..." : "Register"}
            </Button>

            <Typography sx={{ mt: 2 }}>
              Already have an account?{" "}
              <Link
                component={RouterLink}
                to="/login"
                underline="hover"
                color="primary"
                sx={{ fontWeight: 700 }}
              >
                Login
              </Link>
            </Typography>

          </Box>
        </Paper>

      </Container>

    </Box>
  );
}

export default RegisterPage;