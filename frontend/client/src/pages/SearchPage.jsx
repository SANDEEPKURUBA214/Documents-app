import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Typography,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  IconButton,
  Box,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import API from "../utils/axios.js";
import { useAuthStore } from "../store/useAuthStore";
import { format } from "date-fns";
import Linkify from "linkify-react";



export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalDoc, setModalDoc] = useState(null);
  const [editDoc, setEditDoc] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const { user } = useAuthStore();
  const [deleteDocId, setDeleteDocId] = useState(null);
  const isAdmin = user?.role === "admin";


  // 🔎 Search onChange (debounced)
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.trim()) {
        try {
          setLoading(true);
          const res = await API.get(`/docs/search?q=${encodeURIComponent(query)}`);
          setResults(res.data);
        } catch {
          setSnackbar({ open: true, message: "Search failed", severity: "error" });
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // 🗑 Delete document (Admin only)
// state for delete confirmation


// delete confirm handler
const handleDelete = async () => {
  try {
    await API.delete(`/docs/${deleteDocId}`);
    setResults((prev) => prev.filter((doc) => doc._id !== deleteDocId));
    setSnackbar({ open: true, message: "Document deleted", severity: "success" });
  } catch {
    setSnackbar({ open: true, message: "Failed to delete", severity: "error" });
  } finally {
    setDeleteDocId(null); // close dialog
  }
};


  // 💾 Save edited document
  const handleSaveEdit = async () => {
    try {
      const res = await API.put(`/docs/${editDoc._id}`, {
        title: editDoc.title,
        content: editDoc.content,
      });
      setResults((prev) => prev.map((d) => (d._id === editDoc._id ? res.data : d)));
      setSnackbar({ open: true, message: "Document updated", severity: "success" });
      setEditDoc(null);
    } catch {
      setSnackbar({ open: true, message: "Failed to update", severity: "error" });
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Search Documents
      </Typography>

      <TextField
        fullWidth
        placeholder="Search by title or content"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 3 }}
      />

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {results.map((doc) => (
            <Grid item xs={12} key={doc._id}>
              <Box
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  p: 2,
                  cursor: "pointer",
                  "&:hover": { boxShadow: 2 },
                }}
                onClick={() => setModalDoc(doc)}
              >
                <Typography variant="h6">{doc.title}</Typography>
                  <Typography variant="caption" display="block">
                    Created by: {doc.createdBy?.name || "Unknown"} ({doc.createdBy?.email || "—"})
                  </Typography>
                  <Typography variant="caption" display="block">
                    {doc.createdAt ? format(new Date(doc.createdAt), "PPP") : "—"}
                  </Typography>


                
                {/* <Typography>{createdby}</Typography> */}


                {/* Admin actions under the card */}
                {isAdmin && (
                  <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditDoc(doc);
                      }}
                    >
                      <EditIcon/>
                      
                    </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteDocId(doc._id); // open delete dialog
                        }}
                        >
                      <Delete />
                    </IconButton>

                  </Box>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteDocId} onClose={() => setDeleteDocId(null)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this document?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDocId(null)}>Cancel</Button>
            <Button color="error" variant="contained" onClick={handleDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>


      {/* View Modal */}
      <Dialog open={!!modalDoc} onClose={() => setModalDoc(null)} maxWidth="md" fullWidth>
  <DialogTitle>{modalDoc?.title}</DialogTitle>
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
        {modalDoc?.content || ""}
      </Linkify>
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setModalDoc(null)}>Close</Button>
  </DialogActions>
</Dialog>


      {/* Edit Modal (Admin only) */}
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDoc(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Save
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
