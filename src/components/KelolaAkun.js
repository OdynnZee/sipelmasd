// src/components/KelolaAkun.js
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../auth/firebase";

const KelolaAkun = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "petugas",
  });

  const fetchUsers = async () => {
    try {
      const res = await api.get("/auth/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Gagal mengambil akun:", err);
      alert("Gagal mengambil akun.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus akun ini?")) return;
    try {
      await api.delete(`/auth/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Gagal menghapus akun:", err);
      alert("Gagal menghapus akun.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      alert("Semua field wajib diisi.");
      return;
    }

    try {
      if (form.role === "masyarakat") {
        // Buat akun di Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );

        const uid = userCredential.user.uid;

        // Simpan data masyarakat ke backend
        await api.post("/auth/register-masyarakat", {
          name: form.name,
          email: form.email,
          role: form.role,
          uid,
        });
      } else {
        // Untuk petugas/admin → buat via MongoDB
        await api.post("/create-user", form);
      }

      setForm({ name: "", email: "", password: "", role: "petugas" });
      fetchUsers();
    } catch (err) {
      console.error("Gagal menambah akun:", err);
      alert("Gagal menambah akun: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>👥 Kelola Akun</h2>
      <p>Halaman ini digunakan untuk mengelola akun Petugas dan Masyarakat.</p>

      <h3>➕ Tambah Akun Baru</h3>
      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <input
          type="text"
          placeholder="Nama"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          style={{ padding: "8px", marginRight: "10px", width: "200px" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          style={{ padding: "8px", marginRight: "10px", width: "200px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          style={{ padding: "8px", marginRight: "10px", width: "200px" }}
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          style={{ padding: "8px", marginRight: "10px" }}
        >
          <option value="petugas">Petugas</option>
          <option value="masyarakat">Masyarakat</option>
        </select>
        <button
          type="submit"
          style={{
            padding: "8px 15px",
            backgroundColor: "#004080",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Tambah
        </button>
      </form>

      <h3>📄 Daftar Akun</h3>
      {users.length === 0 ? (
        <p>Belum ada akun.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#eee" }}>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Nama</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Email</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Role</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id || u.uid}>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{u.name}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{u.email}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc", textTransform: "capitalize" }}>{u.role}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                  {u.role !== "admin" && (
                    <button
                      onClick={() => handleDelete(u._id)}
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "5px 10px",
                        cursor: "pointer",
                      }}
                    >
                      Hapus
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default KelolaAkun;
