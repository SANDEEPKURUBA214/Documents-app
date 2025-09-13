import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import DocCard from "../components/DocCard";
import API from "../utils/axios";
import { useAuthStore } from "../store/useAuthStore";
import Linkify from "linkify-react";

export default function MyDocsPage() {
  const [docs, setDocs] = useState([]);
  const [editDoc, setEditDoc] = useState(null);
  const [viewDoc, setViewDoc] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [deleteDoc, setDeleteDoc] = useState(null); // holds doc to delete
  const { user } = useAuthStore();

  useEffect(() => {
    API.get("/docs")
      .then((res) => setDocs(res.data))
      .catch(() =>
        setSnackbar({ open: true, message: "Failed to load documents", severity: "error" })
      );
  }, []);

  // Delete handler
  const confirmDelete = async () => {
    if (!deleteDoc) return;
    try {
      await API.delete(`/docs/${deleteDoc._id}`);
      setDocs(docs.filter((d) => d._id !== deleteDoc._id));
      setSnackbar({ open: true, message: "Document deleted", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Delete failed", severity: "error" });
    } finally {
      setDeleteDoc(null); // close dialog
    }
  };

  // Save edit handler
  const handleUpdateDoc = async () => {
    try {
      const res = await API.put(`/docs/${editDoc._id}`, editDoc);
      setDocs(docs.map((d) => (d._id === editDoc._id ? res.data : d)));
      setSnackbar({ open: true, message: "Document updated", severity: "success" });
      setEditDoc(null);
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to update document", severity: "error" });
    }
  };

  const handleSaveEdit = () => {
    if (!editDoc.title || !editDoc.content) {
      setSnackbar({ open: true, message: "Title and Content are required", severity: "warning" });
      return;
    }
    handleUpdateDoc();
  };

  return (
  <Container>
    <Box>
      <Typography variant="h4" gutterBottom>
        My Documents
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
        {user?.email}
      </Typography>

      {docs.map((doc) => (
        <DocCard
          key={doc._id}
          doc={doc}
          isOwner
          showAuthor={false}
          showDate
          onDelete={() => setDeleteDoc(doc)}
          onEdit={setEditDoc}
          onOpen={setViewDoc}
        />
      ))}
    </Box>

    {/* View Modal */}
    <Dialog open={!!viewDoc} onClose={() => setViewDoc(null)} maxWidth="md" fullWidth>
      <DialogTitle>{viewDoc?.title}</DialogTitle>
      <DialogContent dividers>
        <Typography
          variant="body1"
          sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        >
          <Linkify
            options={{
              target: "_blank",
              rel: "noopener noreferrer",
              render: ({ attributes, content }) => (
                <a {...attributes}>Click for more info</a>
              ),
            }}
          >
            {viewDoc?.content || ""}
          </Linkify>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setViewDoc(null)}>Close</Button>
      </DialogActions>
    </Dialog>

    {/* Edit Modal */}
    <Dialog open={!!editDoc} onClose={() => setEditDoc(null)} maxWidth="md" fullWidth>
      <DialogTitle>Edit Document</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Title"
          margin="normal"
          value={editDoc?.title || ""}
          onChange={(e) => setEditDoc({ ...editDoc, title: e.target.value })}
        />
        <TextField
          fullWidth
          multiline
          rows={6}
          label="Content"
          margin="normal"
          value={editDoc?.content || ""}
          onChange={(e) => setEditDoc({ ...editDoc, content: e.target.value })}
          sx={{ whiteSpace: "pre-wrap" }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setEditDoc(null)}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSaveEdit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>

    {/* Delete Confirmation Modal */}
    <Dialog open={!!deleteDoc} onClose={() => setDeleteDoc(null)}>
      <DialogTitle>Delete Document</DialogTitle>
      <DialogContent>
        Are you sure you want to delete <b>{deleteDoc?.title}</b>?
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteDoc(null)}>Cancel</Button>
        <Button variant="contained" color="error" onClick={confirmDelete}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>

    {/* Snackbar */}
    <Snackbar
      open={snackbar.open}
      autoHideDuration={3000}
      onClose={() => setSnackbar({ ...snackbar, open: false })}
    >
      <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  </Container>
);
}
