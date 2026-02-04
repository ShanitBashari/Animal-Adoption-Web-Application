import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import AnimalDetailsPage from "./pages/AnimalDetailsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AddAnimalPage from "./pages/AddAnimalPage";
import MyAnimalsPage from "./pages/MyAnimalsPage";
import AdoptionRequestsPage from "./pages/AdoptionRequestsPage";
import AdminPage from "./pages/AdminPage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/animal/:id" element={<AnimalDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/add-animal" element={<AddAnimalPage />} />
        <Route path="/my-animals" element={<MyAnimalsPage />} />
        <Route path="/requests" element={<AdoptionRequestsPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
