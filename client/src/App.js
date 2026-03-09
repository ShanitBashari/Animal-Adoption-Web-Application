import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import AnimalDetailsPage from "./pages/AnimalDetailsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyListingsPage from "./pages/MyListingsPage";
import AdoptionRequestsPage from "./pages/AdoptionRequestsPage";
import AdminPage from "./pages/AdminPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminRequestsPage from "./pages/AdminRequestsPage";
import AdminAnimalsPage from "./pages/AdminAnimalsPage";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ProtectedRoute, AdminRoute } from "./auth/ProtectedRoute";

function App() {
  return (
    <>
      <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/animal/:id" element={<AnimalDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/my-animals"
            element={
              <ProtectedRoute>
                <MyListingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <ProtectedRoute>
                <AdoptionRequestsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/requests"
            element={
              <AdminRoute>
                <AdminRequestsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/animals"
            element={
              <AdminRoute>
                <AdminAnimalsPage />
              </AdminRoute>
            }
          />
        </Routes>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          pauseOnHover
        />
    </>
  );
}

export default App;