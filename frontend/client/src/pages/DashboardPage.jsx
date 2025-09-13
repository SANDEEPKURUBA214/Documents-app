 
 
import { useState, useEffect } from "react";
import {
 Container, Box, Typography, Dialog, DialogTitle, DialogContent,
 DialogActions, Button, Snackbar, Alert
 } from "@mui/material";

import DocCard from "../components/DocCard";
import API from "../utils/axios";
import { useAuthStore } from "../store/useAuthStore";
import { format } from "date-fns";
import Linkify from "linkify-react";



export default function DashboardPage() {
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "",severity: "success" });
 const { user } = useAuthStore();

  useEffect(() => {
    API.get("/docs/all")
      .then(res => setDocs(res.data))
      .catch(() => setSnackbar({ open: true, message: "Failed to load documents", severity: "error" }));
    }, []);
    const handleOpen = (doc) => setSelectedDoc(doc);
    const handleClose = () => setSelectedDoc(null);
 7
return (
 <Container
       sx={{
          pt: "80px",   // push down from topbar height (adjust to your topbar height)
          pb: "70px",   // push up from bottombar height (adjust to your bottom bar height)
        }}
      >

      <Box>
        <Typography variant="h4" gutterBottom>
          All Documents
        </Typography>

        {docs.map(doc => (
          <DocCard
            key={doc._id}
            doc={doc}
            onOpen={handleOpen}
            showAuthor={true}
            showDate={true}
      // view-only for everyone here, including admin (per your spec)
            isOwner={false}

          />
        ))}
      </Box>
          {/* View Modal */}
          <Dialog open={!!selectedDoc} onClose={handleClose} maxWidth="md" fullWidth>
  <DialogTitle>{selectedDoc?.title}</DialogTitle>
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
              {selectedDoc?.content || ""}
            </Linkify>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

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

