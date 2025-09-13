import { useState } from "react";
import { Container, TextField, Button, Typography, Box, CircularProgress } from "@mui/material";
import API from "../utils/axios.js";
import { useNavigate, useLocation } from "react-router-dom";
import { useNotification } from "../utils/Notification";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const { Notification, showNotification } = useNotification();

  const handleVerify = async () => {
    try {
      setLoading(true);
      await API.post("/auth/verify-otp", { email, otp });
      showNotification("Account verified successfully! Please login.");
      navigate("/login");
    } catch (err) {
      showNotification(err.response?.data?.message || "OTP verification failed", "error");
    }
    setLoading(false);
  };

  if (loading) return <CircularProgress sx={{ mt: 10 }} />;

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 10 }}>
        <Typography variant="h5" gutterBottom>Email Verification</Typography>
        <TextField
          fullWidth
          label="Enter OTP"
          margin="normal"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleVerify}>
          Verify OTP
        </Button>
      </Box>
      <Notification />
    </Container>
  );
}
