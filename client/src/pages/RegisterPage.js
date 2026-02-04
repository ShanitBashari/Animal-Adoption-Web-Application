import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";

function RegisterPage() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});

  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear error on typing
  };

  const validate = () => {
    let tempErrors = {};

    if (values.username.length < 3) {
      tempErrors.username = "Username must be at least 3 characters";
    }

    if (!values.email) {
      tempErrors.email = "Email is required";
    }

    if (values.password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters";
    }

    if (values.password !== values.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    console.log("Register data (frontend only):", values);

    setTimeout(() => navigate("/login"), 1500);
  };

  return (
    <>
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
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              type="submit"
            >
              Register
            </Button>

            <Typography sx={{ mt: 2 }}>
              Already have an account?
              <Link to="/login"> Login</Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default RegisterPage;
