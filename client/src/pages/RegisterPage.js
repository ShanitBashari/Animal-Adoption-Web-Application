import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
  CircularProgress
} from "@mui/material";
import { AuthApi } from "../api/api";

function RegisterPage() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const validate = () => {
    const tempErrors = {};

    if (!values.username || values.username.trim().length < 3) {
      tempErrors.username = "Username must be at least 3 characters";
    }

    if (!values.email || !values.email.trim()) {
      tempErrors.email = "Email is required";
    } else {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim());
      if (!emailOk) tempErrors.email = "Email is invalid";
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

      navigate("/login", { replace: true });
    } catch (err) {
      setServerError(err?.message || "Register failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={8}
        sx={{
          mt: 8,
          p: 5,
          borderRadius: "2rem",
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
            Already have an account?
            <Link to="/login"> Login</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default RegisterPage;