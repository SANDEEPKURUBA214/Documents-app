import { Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import MyDocsPage from "./pages/MyDocsPage";
import SearchPage from "./pages/SearchPage";
import AddEditDocPage from "./pages/AddEditDocPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage"
import { useAuthStore } from "./store/useAuthStore";
import BottomNav from "./components/BottomNav";
import ErrorBoundary from "./ErrorBoundary";
import VerifyOtpPage from "./pages/VerifyOtpPage"
import "./App.css";


export default function App() {
  const { user } = useAuthStore();

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        

        {/* Protected routes wrapped in BottomNav */}
        {user && (
          <Route element={<BottomNav />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/mydocs" element={<MyDocsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/add" element={<AddEditDocPage />} />
            <Route path="/edit/:id" element={<AddEditDocPage />} />
            {user.role === "admin" && (
              <Route path="/admin" element={<AdminPage />} />
            )}
          </Route>
        )}

        {/* Redirect fallback */}
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </ErrorBoundary>
  );
}
