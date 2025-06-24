import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // Pastikan ini benar

const BuatLaporan = () => {
  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("Umum");
  const [isi, setIsi] = useState("");
  const [gambar, setGambar] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("nama", nama);
      formData.append("alamat", alamat);
      formData.append("judul", judul);
      formData.append("kategori", kategori);
      formData.append("isi", isi);
      if (gambar) {
        formData.append("gambar", gambar);
      }

      await api.post("/laporan", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Laporan berhasil dikirim!");
      // Reset form
      setNama("");
      setAlamat("");
      setJudul("");
      setKategori("Umum");
      setIsi("");
      setGambar(null);

      // Arahkan ke dashboard
      navigate("/list-laporan");
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Terjadi kesalahan saat mengirim laporan.";
      alert("❌ Gagal mengirim laporan: " + msg);
      console.error("Error laporan:", error);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ marginBottom: "20px", color: "#004080" }}>Buat Laporan</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>Nama:</label>
        <input
          type="text"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          required
        />

        <label>Alamat:</label>
        <input
          type="text"
          value={alamat}
          onChange={(e) => setAlamat(e.target.value)}
          required
        />

        <label>Judul Laporan:</label>
        <input
          type="text"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          required
        />

        <label>Kategori:</label>
        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          required
        >
          <option value="Umum">Umum</option>
          <option value="Fasilitas Publik">Fasilitas Publik</option>
          <option value="Infrastruktur">Infrastruktur</option>
          <option value="Lainnya">Lainnya</option>
        </select>

        <label>Isi Laporan:</label>
        <textarea
          value={isi}
          onChange={(e) => setIsi(e.target.value)}
          required
        />

        <label>Unggah Bukti Gambar (Opsional):</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setGambar(e.target.files[0])}
        />

        <button
          type="submit"
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Kirim Laporan
        </button>
      </form>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
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

export default BuatLaporan;
