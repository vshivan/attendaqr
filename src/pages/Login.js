import { useState } from "react";
import API from "../services/api";
import { Container, Box, Typography, TextField, Button, Paper, Alert, InputAdornment } from "@mui/material";
import { Email, Lock, Login as LoginIcon } from "@mui/icons-material";
import { keyframes } from "@emotion/react";
import { styled } from "@mui/material/styles";

// Floating animation
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  borderRadius: 30,
  padding: 40,
  width: '100%',
  maxWidth: 400,
  textAlign: 'center',
  boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
}));

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);

        // ROLE BASED NAVIGATION
        if (res.data.role === "admin")
          window.location = "/admin";
        else
          window.location = "/scan";
      } else {
        setError("Invalid Credentials");
      }
    } catch (err) {
      setError("Login Failed. Please check your network or credentials.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #4361EE 0%, #F72585 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Shapes */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: 100,
        height: 100,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.2)',
        animation: `${float} 6s ease-in-out infinite`
      }} />

      <Box sx={{
        position: 'absolute',
        bottom: '15%',
        right: '10%',
        width: 150,
        height: 150,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.15)',
        animation: `${float} 8s ease-in-out infinite reverse`
      }} />

      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', zIndex: 1 }}>
        <StyledPaper elevation={12}>

          <Box mb={4} display="flex" flexDirection="column" alignItems="center">
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: 3,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                boxShadow: '0 8px 16px rgba(67, 97, 238, 0.3)'
              }}
            >
              <LoginIcon sx={{ color: 'white', fontSize: 32 }} />
            </Box>
            <Typography variant="h4" fontWeight="bold" color="text.primary" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to your account
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              placeholder="Email Address"
              fullWidth
              variant="outlined"
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 3 }
              }}
            />

            <TextField
              placeholder="Password"
              type="password"
              fullWidth
              variant="outlined"
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 3 }
              }}
            />

            <Button
              variant="contained"
              size="large"
              onClick={login}
              sx={{
                mt: 2,
                py: 1.5,
                fontSize: '1rem',
                textTransform: 'none',
                background: 'linear-gradient(90deg, #4361EE 0%, #3F37C9 100%)',
              }}
            >
              Log In
            </Button>

          </Box>
        </StyledPaper>
      </Container>
    </Box>
  );
}
