import { useEffect, useState } from "react";
import {
  Container, Typography, Grid, Card, CardContent, Box,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, TextField, Chip, Stack
} from "@mui/material";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import API from "../utils/axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import App from './../App';
import { format } from "date-fns"; // ✅ add at the top
import Linkify from "linkify-react";


export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [docs, setDocs] = useState([]);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteDocId, setDeleteDocId] = useState(null);
  const [editDoc, setEditDoc] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [viewDoc, setViewDoc] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchData = async () => {
    try {
      const usersRes = await API.get("/admin/users");
      const docsRes = await API.get("/admin/docs");
      setUsers(usersRes.data);
      setDocs(docsRes.data);
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to fetch data", severity: "error" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Delete User
  const confirmDeleteUser = (id) => setDeleteUserId(id);
  const handleDeleteUser = async () => {
    try {
      await API.delete(`/admin/users/${deleteUserId}`);
      setUsers(users.filter(user => user._id !== deleteUserId));
      setSnackbar({ open: true, message: "User deleted successfully", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to delete user", severity: "error" });
    } finally {
      setDeleteUserId(null);
    }
  };

  // Delete Doc
  const confirmDeleteDoc = (id) => setDeleteDocId(id);
  const handleDeleteDoc = async () => {
    try {
      await API.delete(`/docs/${deleteDocId}`);
      setDocs(docs.filter(doc => doc._id !== deleteDocId));
      setSnackbar({ open: true, message: "Document deleted successfully", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to delete document", severity: "error" });
    } finally {
      setDeleteDocId(null);
    }
  };

  // Save Edited Doc
  const handleSaveEditDoc = async () => {
    try {
      const res = await API.put(`/docs/${editDoc._id}`, {
        title: editDoc.title,
        content: editDoc.content,
      });
      setDocs(docs.map(d => d._id === editDoc._id ? res.data : d));
      setSnackbar({ open: true, message: "Document updated successfully", severity: "success" });
      setEditDoc(null);
    } catch {
      setSnackbar({ open: true, message: "Failed to update document", severity: "error" });
    }
  };

return (
  <Container>
    <Typography variant="h4" gutterBottom>
      Admin Panel
    </Typography>

    {/* Users */}
    <Typography variant="h6" sx={{ mt: 3 }}>
      All Users
    </Typography>
    <Grid container spacing={2} sx={{ mt: 1 }}>
      {users.map((u) => (
        <Grid item xs={12} sm={6} md={4} key={u._id}>
          <Card
            sx={{
              cursor: "pointer",
              "&:hover": { boxShadow: 6 },
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
            onClick={() => setViewUser(u)}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6">{u.name || "—"}</Typography>
              <Typography variant="body2">{u.email || "—"}</Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end" }}>
              <Button
                color="error"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  confirmDeleteUser(u._id);
                }}
              >
                <DeleteIcon fontSize="small" />
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>

    {/* Documents */}
    <Typography variant="h6" sx={{ mt: 4 }}>
      All Documents
    </Typography>
    <Grid container spacing={2} sx={{ mt: 1 }}>
      {docs.map((d) => (
        <Grid item xs={12} sm={6} md={4} key={d._id}>
          <Card
            sx={{
              cursor: "pointer",
              "&:hover": { boxShadow: 6 },
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
            onClick={() => setViewDoc(d)}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6">{d.title}</Typography>
              <Typography
                  variant="body2"
                  sx={{
                    mb: 1,
                    whiteSpace: "pre-line",
                    maxHeight: "2.5em",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  <Linkify
                    options={{
                      target: "_blank",
                      rel: "noopener noreferrer",
                      render: ({ attributes }) => <a {...attributes}>Click for more info</a>,
                    }}
                  >
                    {d.content.length > 100 ? d.content.substring(0, 100) + "..." : d.content}
                  </Linkify>
                </Typography>

              <Typography variant="caption" display="block">
                Created by: {d.createdBy?.name || "Unknown"}
              </Typography>
              <Typography variant="caption" display="block">
                On: {d.createdAt ? format(new Date(d.createdAt), "PPP") : "—"}
              </Typography>
              <Typography variant="caption" display="block">
                Email: {d.createdBy?.email || "—"}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end" }}>
              <Button
                color="primary"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditDoc(d);
                }}
              >
                <EditIcon fontSize="small" />
              </Button>
              <Button
                color="error"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  confirmDeleteDoc(d._id);
                }}
              >
                <DeleteIcon fontSize="small" />
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>

    {/* View Document Modal */}
    <Dialog open={!!viewDoc} onClose={() => setViewDoc(null)} maxWidth="md" fullWidth>
      <DialogTitle>Document Details</DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6">{viewDoc?.title}</Typography>
        <Typography sx={{ whiteSpace: "pre-wrap", mt: 2, wordBreak: "break-word" }}>
          <Linkify
            options={{
              target: "_blank",
              rel: "noopener noreferrer",
              render: ({ attributes }) => <a {...attributes}>Click for more info</a>,
            }}
          >
            {viewDoc?.content || ""}
          </Linkify>
        </Typography>

        {viewDoc?.tags?.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }}>
            {viewDoc.tags.map((tag, idx) => (
              <Chip key={idx} label={tag} size="small" />
            ))}
          </Stack>
        )}

        <Typography sx={{ mt: 2 }} variant="body2" color="text.secondary">
          By {viewDoc?.createdBy?.name || "Unknown"} ({viewDoc?.createdBy?.email || "—"})
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Created at: {viewDoc?.createdAt ? new Date(viewDoc.createdAt).toLocaleString() : "—"}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setViewDoc(null)}>Close</Button>
      </DialogActions>
    </Dialog>

    {/* Edit Document Modal */}
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
        <Button variant="contained" color="primary" onClick={handleSaveEditDoc}>
          Save
        </Button>
      </DialogActions>
    </Dialog>

    {/* Delete User Modal */}
    <Dialog open={!!deleteUserId} onClose={() => setDeleteUserId(null)}>
      <DialogTitle>Confirm Delete User</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this user?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteUserId(null)}>Cancel</Button>
        <Button color="error" onClick={handleDeleteUser}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>

    {/* Delete Document Modal */}
    <Dialog open={!!deleteDocId} onClose={() => setDeleteDocId(null)}>
      <DialogTitle>Confirm Delete Document</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this document?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteDocId(null)}>Cancel</Button>
        <Button color="error" onClick={handleDeleteDoc}>
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
