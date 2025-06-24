import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // Pastikan baseURL di api.js = http://localhost:3001/api

const ListLaporan = () => {
  const [laporan, setLaporan] = useState([]);
  const [showImage, setShowImage] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        const res = await api.get("/laporan");
        setLaporan(res.data);
      } catch (error) {
        console.error("Gagal mengambil data laporan:", error);
        alert("Gagal mengambil laporan: " + (error.response?.data?.message || error.message));
      }
    };

    fetchLaporan();
  }, []);

  const toggleImage = (id) => {
    setShowImage((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ marginBottom: "20px", color: "#004080" }}>📋 Daftar Laporan</h2>

      {laporan.length === 0 ? (
        <p>Tidak ada laporan ditemukan.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {laporan.map((item) => (
            <li
              key={item._id}
              style={{
                marginBottom: "30px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "15px",
                background: "#f9f9f9",
              }}
            >
              <h3 style={{ color: "#004080" }}>{item.judul}</h3>
              <p><strong>Status:</strong> <span style={{
                color:
                  item.status === "pending" ? "orange" :
                  item.status === "diproses" ? "blue" :
                  item.status === "diterima" ? "green" :
                  item.status === "dibatalkan" ? "red" : "black",
                fontWeight: "bold"
              }}>{item.status?.toUpperCase()}</span></p>
              <p><strong>Nama:</strong> {item.nama}</p>
              <p><strong>Alamat:</strong> {item.alamat}</p>
              <p><strong>Kategori:</strong> {item.kategori}</p>
              <p><strong>Tanggal:</strong> {new Date(item.tanggal).toLocaleString()}</p>
              <p><strong>Isi Laporan:</strong> {item.isi}</p>

              {item.gambar && (
                <>
                  <button
                    onClick={() => toggleImage(item._id)}
                    style={{
                      marginTop: "10px",
                      backgroundColor: "#004080",
                      color: "#fff",
                      padding: "8px 15px",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    {showImage[item._id] ? "Sembunyikan Gambar" : "Lihat Bukti Gambar"}
                  </button>

                  {showImage[item._id] && (
                    <div style={{ marginTop: "10px" }}>
                      <img
                        src={`http://localhost:3001/uploads/${item.gambar}`}
                        alt="Bukti Laporan"
                        style={{
                          maxWidth: "100%",
                          borderRadius: "6px",
                          marginTop: "10px",
                          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/400x300?text=Gambar+tidak+tersedia";
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button
          onClick={() => navigate("/dashboard-masyarakat")}
          style={{
            backgroundColor: "#004080",
            color: "white",
            padding: "10px 25px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          ← Kembali ke Beranda
        </button>
      </div>
    </div>
  );
};

export default ListLaporan;
