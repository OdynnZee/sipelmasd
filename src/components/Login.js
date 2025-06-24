import React, { useState, useEffect } from "react";
import axios from "axios";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../auth/firebase"; // Pastikan path sesuai

const Login = () => {
  const [role, setRole] = useState("masyarakat");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Ambil token CSRF dari backend jika perlu
  useEffect(() => {
    axios.get("http://localhost:3001/api/csrf-token", { withCredentials: true })
      .then((res) => {
        axios.defaults.headers.post["X-CSRF-Token"] = res.data.csrfToken;
      })
      .catch((err) => console.warn("Gagal ambil token CSRF:", err.message));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      alert("Email dan password wajib diisi.");
      setLoading(false);
      return;
    }

    try {
      if (role === "masyarakat") {
        // 🔐 Login via Firebase
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login masyarakat berhasil!");
        navigate("/dashboard-masyarakat");
      } else {
        // 🔐 Login via Backend (admin/petugas)
        const res = await axios.post("http://localhost:3001/api/auth/login", {
          email,
          password,
        }, { withCredentials: true });

        const { token, user } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        alert(`Login ${user.role} berhasil!`);
        navigate("/dashboard");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Login gagal";
      alert(`Login ${role} gagal: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "3rem auto",
        padding: "2rem",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        🔐 Login SiPelMasD
      </h2>

      <form onSubmit={handleLogin}>
        <label style={{ display: "block", marginBottom: "8px" }}>
          Login Sebagai:
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "4px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          >
            <option value="masyarakat">Masyarakat</option>
            <option value="admin">Admin / Petugas</option>
          </select>
        </label>

        <label style={{ display: "block", marginBottom: "8px" }}>
          Email:
          <input
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "4px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </label>

        <label style={{ display: "block", marginBottom: "12px" }}>
          Kata Sandi:
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "4px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: loading ? "#aaa" : "#0077cc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </div>
  );
};

export default Login;
