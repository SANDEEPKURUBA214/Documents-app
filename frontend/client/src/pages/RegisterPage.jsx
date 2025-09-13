import { useState } from "react";
import { Container, TextField, Button, Typography, Box, CircularProgress } from "@mui/material";
import API from "../utils/axios.js";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../utils/Notification";
import { js } from '@eslint/js';

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { Notification, showNotification } = useNotification();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await API.post("/auth/register", {
        name,
        email,
        password,
        role: "user", // always user by default
      });
      showNotification("OTP sent to email. Please verify.");
      navigate("/verify-otp", { state: { email } }); // pass email to verify page
    } catch (err) {
      showNotification(err.response?.data?.message || "Registration failed", "error");
    }
    setLoading(false);
  };

  if (loading) return <CircularProgress sx={{ mt: 10 }} />;

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 10 }}>
        <Typography variant="h4" gutterBottom>Register</Typography>
        <TextField fullWidth label="Name" margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField fullWidth label="Email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField fullWidth type="password" label="Password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>Register</Button>
        <Typography sx={{ mt: 2 }}>
          Already have an account? <a href="/login">Login</a>
        </Typography>
      </Box>
      <Notification />
    </Container>
  );
}

