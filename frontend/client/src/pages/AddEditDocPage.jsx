import { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import API from "../utils/axios";
import { CircularProgress } from "@mui/material";
import { useNotification } from "../utils/Notification";

export default function AddEditDocPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { Notification, showNotification } = useNotification();
  const [loading, setLoading] = useState(false); // <-- Start as false

  useEffect(() => {
    if (id) {
      setLoading(true); // <-- Only set loading true when fetching
      API.get(`/docs/${id}`)
        .then((res) => {
          setTitle(res.data.title);
          setContent(res.data.content);
        })
        .catch((err) => {
          showNotification("Failed to load document", "error");
        })
        .finally(() => setLoading(false));
    }
  }, [id, showNotification]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (id) {
        await API.put(`/docs/${id}`, { title, content });
        showNotification("Document updated!");
      } else {
        await API.post("/docs", { title, content });
        showNotification("Document created!", "success");
      }
      navigate("/dashboard");
    } catch (err) {
      showNotification(err.response?.data?.message || "Error saving document");
    }
    setLoading(false);
  };

  if (loading) return <CircularProgress sx={{ mt: 10 }} />;

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        {id ? "Edit Document" : "Add Document"}
      </Typography>
      <TextField
        fullWidth
        label="Title"
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        fullWidth
        multiline
        rows={6}
        label="Content"
        margin="normal"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={handleSubmit}>
          {id ? "Update" : "Create"}
        </Button>
      </Box>
      <Notification />
    </Container>
  );
}
