import { Snackbar, Alert } from "@mui/material";
import { useState } from "react";

function useNotification() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");

  const showNotification = (msg, type = "info") => {
    setMessage(msg);
    setSeverity(type);
    setOpen(true);
  };

  const Notification = () => (
    <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
      <Alert severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );

  return { Notification, showNotification };
}

export { useNotification };
