import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Halaman Utama / Login
import Login from "./components/Login";

// Dashboard
import Dashboard from "./components/Dashboard"; // Gabungan admin & petugas
import DashboardMasyarakat from "./components/DashboardMasyarakat";

// Laporan
import BuatLaporan from "./components/BuatLaporan";
import ListLaporan from "./components/ListLaporan";

// Fitur Tambahan
import GraphQLQuery from "./components/GraphQLQuery";
import KelolaAkun from "./components/KelolaAkun"; // opsional

// Styling Global
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🏠 Halaman Login */}
        <Route path="/" element={<Login />} />

        {/* 👤 Dashboard untuk Masyarakat */}
        <Route path="/dashboard-masyarakat" element={<DashboardMasyarakat />} />

        {/* 🛠️ Dashboard untuk Admin dan Petugas */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* 📝 Form Buat Laporan */}
        <Route path="/buat-laporan" element={<BuatLaporan />} />

        {/* 📄 Daftar Semua Laporan */}
        <Route path="/list-laporan" element={<ListLaporan />} />

        {/* 🧠 Halaman Query GraphQL */}
        <Route path="/graphql" element={<GraphQLQuery />} />

        {/* 👥 Kelola Akun (Hanya admin, opsional) */}
        <Route path="/kelola-akun" element={<KelolaAkun />} />
      </Routes>
    </Router>
  );
}

export default App;
