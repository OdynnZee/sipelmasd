import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";

const Dashboard = () => {
  const [laporan, setLaporan] = useState([]);
  const [showImage, setShowImage] = useState({});
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        const res = await api.get("/laporan");
        setLaporan(res.data);
      } catch (error) {
        console.error("Gagal mengambil data laporan:", error);
        alert("Gagal mengambil data laporan: " + (error.response?.data?.message || error.message));
      }
    };

    fetchLaporan();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await api.put(`/laporan/${id}`, { status: newStatus });
      setLaporan((prev) =>
        prev.map((lap) =>
          lap._id === id ? { ...lap, status: res.data.laporan.status } : lap
        )
      );
    } catch (error) {
      console.error("Gagal mengubah status:", error);
      alert("Gagal mengubah status: " + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus laporan ini?")) {
      try {
        await api.delete(`/laporan/${id}`);
        setLaporan((prev) => prev.filter((lap) => lap._id !== id));
      } catch (error) {
        console.error("Gagal menghapus laporan:", error);
        alert("Gagal menghapus laporan: " + (error.response?.data?.message || error.message));
      }
    }
  };

  const toggleImage = (id) => {
    setShowImage((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>SiPelMasD</h2>
        <ul>
          <li>📥 Laporan Masuk</li>
          <li>
            <Link to="/graphql" className="nav-link">🧠 GraphQL Query</Link>
          </li>
          {user?.role === "admin" && (
            <li>
              <Link to="/kelola-akun" className="nav-link">👤 Kelola Akun</Link>
            </li>
          )}
          <li onClick={handleLogout} className="logout">🚪 Logout</li>
        </ul>
      </aside>

      <main className="main-content">
        <h1>Selamat datang, {user?.name || "Pengguna"}</h1>
        <h2>Daftar Laporan</h2>

        {laporan.length === 0 ? (
          <p>Belum ada laporan.</p>
        ) : (
          <table className="laporan-table">
            <thead>
              <tr>
                <th>Judul</th>
                <th>Nama</th>
                <th>Alamat</th>
                <th>Kategori</th>
                <th>Status</th>
                <th>Tanggal</th>
                <th>Isi</th>
                <th>Bukti</th>
                {(user?.role === "admin" || user?.role === "petugas") && <th>Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {laporan.map((item) => (
                <tr key={item._id}>
                  <td>{item.judul}</td>
                  <td>{item.nama}</td>
                  <td>{item.alamat}</td>
                  <td>{item.kategori}</td>
                  <td>
                    {(user?.role === "admin" || user?.role === "petugas") ? (
                      <select
                        value={item.status || "pending"}
                        onChange={(e) => handleStatusChange(item._id, e.target.value)}
                        disabled={item.status === "dibatalkan"}
                      >
                        <option value="pending">Pending</option>
                        <option value="diproses">Diproses</option>
                        <option value="diterima">Diterima</option>
                        <option value="dibatalkan">Dibatalkan</option>
                      </select>
                    ) : (
                      <strong>{item.status?.toUpperCase() || "PENDING"}</strong>
                    )}
                  </td>
                  <td>{new Date(item.tanggal).toLocaleString()}</td>
                  <td>{item.isi}</td>
                  <td>
                    {item.gambar && (
                      <>
                        <button
                          onClick={() => toggleImage(item._id)}
                          style={{ padding: "4px 8px", cursor: "pointer", marginBottom: "5px" }}
                        >
                          {showImage[item._id] ? "Sembunyikan" : "Lihat Gambar"}
                        </button>
                        {showImage[item._id] && (
                          <img
                            src={`http://localhost:3001/uploads/${item.gambar}`}
                            alt="Bukti Gambar"
                            style={{ width: "100px", borderRadius: "6px", display: "block" }}
                          />
                        )}
                      </>
                    )}
                  </td>
                  {(user?.role === "admin" || user?.role === "petugas") && (
                    <td>
                      {item.status === "dibatalkan" && (
                        <button
                          onClick={() => handleDelete(item._id)}
                          style={{
                            backgroundColor: "#e74c3c",
                            color: "#fff",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: "4px",
                            cursor: "pointer"
                          }}
                        >
                          Hapus
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
