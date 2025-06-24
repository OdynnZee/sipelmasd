// src/component/DashboardMasyarakat.js
import React from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";

const DashboardMasyarakat = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Selamat Datang di SiPelMasD</h1>
      </header>

      <nav>
        <Link to="/dashboard-masyarakat">Beranda</Link>
        <Link to="/buat-laporan">Buat Laporan</Link>
        <Link to="/list-laporan">Lihat Laporan</Link>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <main>
        <h2>Informasi Umum</h2>
        <p>Gunakan sistem ini untuk menyampaikan keluhan, saran, atau aspirasi.</p>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardMasyarakat;
