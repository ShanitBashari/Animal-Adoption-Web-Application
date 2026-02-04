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

function LoginPage() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let tempErrors = {};

    if (!values.username) {
      tempErrors.username = "Username is required";
    }

    if (!values.password) {
      tempErrors.password = "Password is required";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;


    setTimeout(() => navigate("/"), 1000);
  };

  return (
    <>
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
              label="Password"
              name="password"
              type="password"
              margin="normal"
              value={values.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              type="submit"
            >
              Login
            </Button>

            <Typography sx={{ mt: 2 }}>
              Don’t have an account?
              <Link to="/register"> Register</Link>
            </Typography>
          </Box>
        </Paper>
      </Container>

    </>
  );
}

export default LoginPage;
