// src/components/GraphQLQuery.js
import React, { useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import "./GraphQLQuery.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const GraphQLQuery = () => {
  const [query, setQuery] = useState(`{
    semuaLaporan {
      _id
      nama
      alamat
      judul
      kategori
      isi
      status
      tanggal
    }
  }`);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleQuery = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3001/graphql", {
        query: query,
      });
      setResult(res.data);
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    const data = result?.data?.semuaLaporan || [];
    const grouped = data.reduce((acc, curr) => {
      acc[curr.kategori] = (acc[curr.kategori] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(grouped).map(([kategori, jumlah]) => ({ kategori, jumlah }));
  };

  return (
    <div className="graphql-query-container">
      <h2>🧠 Query Data Laporan (GraphQL)</h2>

      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        rows={8}
        placeholder="Masukkan query GraphQL..."
      />
      <button onClick={handleQuery}>Jalankan Query</button>

      {loading ? (
        <p>⏳ Mengambil data...</p>
      ) : result?.data ? (
        <>
          <h3>📊 Diagram Batang (Kategori)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getChartData()}>
              <XAxis dataKey="kategori" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="jumlah" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>

          <h3>🍩 Diagram Lingkaran</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getChartData()}
                dataKey="jumlah"
                nameKey="kategori"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {getChartData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          <h3>📈 Diagram Lilin (Garis Waktu)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={
                result.data.semuaLaporan.map(item => ({
                  tanggal: new Date(item.tanggal).toLocaleDateString(),
                  jumlah: 1
                }))
              }
            >
              <XAxis dataKey="tanggal" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="jumlah" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </>
      ) : (
        result?.error && <p style={{ color: "red" }}>{result.error}</p>
      )}

      {/* Tombol Kembali ke Dashboard */}
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button
          onClick={() => navigate("/dashboard")}
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
          ← Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
};

export default GraphQLQuery;
