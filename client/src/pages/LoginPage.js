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
import { useAuth } from "../auth/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [values, setValues] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const validate = () => {
    const temp = {};
    if (!values.username.trim()) temp.username = "Username is required";
    if (!values.password) temp.password = "Password is required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const toFriendlyMessage = (err) => {
    // מה שבא מהשרת (GlobalExceptionHandler) יגיע ב-err.message
    // אבל נעשה fallback לפי status אם צריך
    const status = err?.status;

    if (status === 401) return "Invalid username or password";
    if (status === 403) return "You are not allowed to login";
    if (status === 400) return err?.message || "Invalid input";
    if (status === 500) return "Server error. Please try again.";
    return err?.message || "Login failed";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError("");

    try {
      const res = await login(values.username.trim(), values.password);

      const roles = res?.roles || [];
      const isAdmin = roles.includes("ADMIN");

      navigate(isAdmin ? "/admin" : "/", { replace: true });
    } catch (err) {
      // 👈 לא עושים navigate. נשארים בדף ומציגים הודעה.
      setServerError(toFriendlyMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={8}
        sx={{
          mt: 10,
          p: 10,
          borderRadius: "2rem",
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
            Don’t have an account? <Link to="/register">Register</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;