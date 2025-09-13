// src/components/BottomNav.jsx
import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";

import { useAuthStore } from "../store/useAuthStore";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const [value, setValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  // Sync selected tab with route
  useEffect(() => {
    if (location.pathname.startsWith("/dashboard")) setValue(0);
    else if (location.pathname.startsWith("/mydocs")) setValue(1);
    else if (location.pathname.startsWith("/search")) setValue(2);
    else if (location.pathname.startsWith("/add")) setValue(3);
    else if (location.pathname.startsWith("/admin")) setValue(4);
  }, [location.pathname]);

  const handleLogoutConfirm = async () => {
    try {
      await Promise.resolve(logout?.());
    } finally {
      setOpenDialog(false);
      navigate("/login", { replace: true });
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Top AppBar */}
      <AppBar position="fixed" sx={{ backgroundColor: "black" }}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, color: "red", cursor: "pointer" }}
            onClick={() => navigate("/dashboard")}
          >
            Documents
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Content wrapper with spacing for AppBar + BottomNav */}
      <Box sx={{ pt: "64px", pb: "56px" }}>
        <Outlet /> {/* 🔑 renders all your routed pages here */}
      </Box>

      {/* Bottom Navigation */}
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
          sx={{
            backgroundColor: "black",
            "& .MuiBottomNavigationAction-root": { color: "white" },
            "& .Mui-selected": { color: "red" },
          }}
        >
          <BottomNavigationAction
            label="Dashboard"
            icon={<DashboardIcon />}
            onClick={() => navigate("/dashboard")}
          />
          <BottomNavigationAction
            label="My Docs"
            icon={<DescriptionIcon />}
            onClick={() => navigate("/mydocs")}
          />
          <BottomNavigationAction
            label="Search"
            icon={<SearchIcon />}
            onClick={() => navigate("/search")}
          />
          <BottomNavigationAction
            label="Add Doc"
            icon={<AddCircleIcon />}
            onClick={() => navigate("/add")}
          />
          {user?.role === "admin" && (
            <BottomNavigationAction
              label="Admin"
              icon={<AdminPanelSettingsIcon />}
              onClick={() => navigate("/admin")}
            />
          )}
          <BottomNavigationAction
            label="Logout"
            icon={<LogoutIcon />}
            onClick={() => setOpenDialog(true)}
          />
        </BottomNavigation>
      </Paper>

      {/* Logout confirmation dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleLogoutConfirm}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
