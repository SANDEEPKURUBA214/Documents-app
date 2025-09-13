import { useState } from "react";
import { Container, TextField, Button, Typography, Box, CircularProgress, Link } from "@mui/material";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../utils/Notification";
import API from './../utils/axios.js';
import { js } from '@eslint/js';


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { Notification, showNotification } = useNotification();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await API.post("/auth/login", { email, password });

      // Save token to localStorage
      localStorage.setItem("token", res.data.token);

      // Store user info in your auth store
      login(res.data.user);

      showNotification("Login successful!", "success");
      navigate("/dashboard");
    } catch (err) {
      showNotification(err.response?.data?.message || "Login failed", "error");
    }
    setLoading(false);
  };

  if (loading) return <CircularProgress sx={{ mt: 10 }} />;

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 10 }}>
        <Typography variant="h4" gutterBottom>Login</Typography>
        <TextField 
          fullWidth 
          label="Email" 
          margin="normal" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <TextField 
          fullWidth 
          type="password" 
          label="Password" 
          margin="normal" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <Button 
          variant="contained" 
          fullWidth 
          sx={{ mt: 2 }} 
          onClick={handleSubmit}
        >
          Login
        </Button>

        {/* Link to Register */}
        <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
          Don’t have an account?{" "}
          <Link component="button" variant="body2" onClick={() => navigate("/register")}>
            Register here
          </Link>
        </Typography>

        <Notification />
      </Box>
    </Container>
  );
}
