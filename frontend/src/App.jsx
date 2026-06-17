import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import logoAksara from "./assets/img/aksarasense_logo.png";
import dikry from "./assets/img/dikry.jpeg";
import enrico from "./assets/img/enrico.jpeg";
import nicholas from "./assets/img/nicholas.png";

export default function App() {
  // DEFAULT LIGHT MODE
  const [darkMode, setDarkMode] = useState(false);

  const [text, setText] = useState("");
const [model] = useState("BiLSTM");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const [newsIndex, setNewsIndex] = useState(0);

  const errorDescriptions = {
  "Deletion Error": {
    title: "Kata Hilang",
    description:
      "Terdapat kata atau bagian kalimat yang kemungkinan hilang sehingga makna kalimat menjadi kurang lengkap."
  },

  "Insertion Error": {
    title: "Kata Berlebih",
    description:
      "Terdapat kata atau karakter yang tidak diperlukan sehingga kalimat menjadi kurang tepat."
  },

  "Spelling Error": {
    title: "Kesalahan Ejaan",
    description:
      "Terdapat kata yang diduga mengalami kesalahan penulisan atau salah eja."
  },

  "Punctuation Error": {
    title: "Kesalahan Tanda Baca",
    description:
      "Terdapat penggunaan tanda baca yang kurang tepat atau tanda baca yang hilang."
  },

  "Real word Error": {
    title: "Kesalahan Konteks Kata",
    description:
      "Kata yang digunakan benar secara ejaan, tetapi kurang sesuai dengan konteks kalimat."
  }
};

const currentError =
  result
    ? errorDescriptions[result.error_type]
    : null;
  const newsSlides = [
  {
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    title: "Generative AI Semakin Canggih",
    desc:
      "Perkembangan Generative AI memungkinkan sistem menghasilkan teks, gambar, video, hingga kode program dengan kualitas yang semakin mendekati hasil karya manusia. Teknologi ini kini dimanfaatkan dalam pendidikan, bisnis, kesehatan, dan pengembangan perangkat lunak untuk meningkatkan produktivitas serta mempercepat proses kerja."
  },

  {
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    title: "AI Agents dan Otomasi Pintar",
    desc:
      "AI Agent merupakan generasi terbaru kecerdasan buatan yang mampu mengambil keputusan dan menjalankan tugas secara mandiri. Teknologi ini dapat membantu mengelola jadwal, melakukan analisis data, berinteraksi dengan pengguna, hingga menyelesaikan pekerjaan kompleks tanpa memerlukan pengawasan manusia secara terus-menerus."
  },

  {
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    title: "Transformer Tetap Menjadi Fondasi AI Modern",
    desc:
      "Arsitektur Transformer menjadi dasar berbagai model AI modern seperti GPT, Gemini, Claude, dan IndoBERT. Teknologi ini memungkinkan pemahaman konteks bahasa yang lebih baik, meningkatkan akurasi analisis teks, penerjemahan bahasa, deteksi kesalahan penulisan, serta berbagai aplikasi Natural Language Processing lainnya."
  },

  {
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
    title: "Multimodal AI Menggabungkan Banyak Jenis Data",
    desc:
      "Multimodal AI mampu memahami dan mengolah berbagai jenis data secara bersamaan seperti teks, gambar, audio, dan video. Kemampuan ini membuka peluang baru dalam pengembangan asisten virtual, sistem pendidikan interaktif, analisis media, serta aplikasi yang membutuhkan pemahaman konteks secara lebih menyeluruh."
  },

  {
    image:
      "https://images.unsplash.com/photo-1535378620166-273708d44e4c",
    title: "AI untuk Pendidikan dan Pembelajaran",
    desc:
      "Kecerdasan buatan semakin banyak digunakan dalam dunia pendidikan untuk membantu siswa dan pengajar. AI dapat memberikan umpan balik otomatis, mendeteksi kesalahan penulisan, membuat materi pembelajaran yang dipersonalisasi, serta membantu proses evaluasi sehingga pengalaman belajar menjadi lebih efektif dan efisien."
  }
];

  const team = [
  {
    name: "Nicholas Ghonius",
    role: "AI Engineer",
    img: nicholas
  },
  {
    name: "Dikri Pajar Alip Nurrohman",
    role: "AI Engineer",
    img: dikry
  
  },
  {
    name: "Enrico Octadarma Hulu",
    role: "AI Engineer",
    img: enrico
  },
];

  // =====================
// AUTO SLIDE NEWS
// =====================
useEffect(() => {
  const interval = setInterval(() => {
    setNewsIndex((prev) => (prev + 1) % newsSlides.length);
  }, 4000);

  return () => clearInterval(interval);
}, []);

// =====================
// LOAD HISTORY FROM LOCALSTORAGE
// =====================
useEffect(() => {
  try {
    const saved = localStorage.getItem("analysis_history");

    if (saved) {
      setHistory(JSON.parse(saved));
    }
  } catch (err) {
    console.log("Error load history:", err);
  }
}, []);

// =====================
// SAVE HISTORY TO LOCALSTORAGE
// =====================
useEffect(() => {
  try {
    localStorage.setItem(
      "analysis_history",
      JSON.stringify(history)
    );
  } catch (err) {
    console.log("Error save history:", err);
  }
}, [history]);

// =====================
// API BASE URL
// =====================
const API_URL =
  "https://enricooctadarma-aksarasense-backend.hf.space";

// =====================
// ANALYZE TEXT (MAIN FUNCTION)
// =====================
const analyzeText = async () => {
  if (!text.trim()) return;

  setLoading(true);

  try {
    const response = await axios.post(
      `${API_URL}/predict`,
      { text },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    if (!response?.data) {
      throw new Error("Backend tidak mengembalikan data");
    }

    const data = response.data;

    const newResult = {
      id: Date.now(),
      text,
      model,
      error_type: data.error_type,
      confidence: data.confidence,
      time: new Date().toLocaleTimeString(),
    };

    setResult(newResult);
    setHistory((prev) => [newResult, ...prev]);
  } catch (error) {
    console.error("Analyze error:", error);

    if (error.response) {
      console.error("Backend response error:", error.response.data);
    } else if (error.request) {
      console.error("No response from backend");
    } else {
      console.error("Axios error:", error.message);
    }

    alert("Gagal terhubung ke backend");
  } finally {
    setLoading(false);
  }
};

// =====================
// CLEAR RESULT
// =====================
const clearText = () => {
  setText("");
  setResult(null);
};

// =====================
// OPEN HISTORY ITEM
// =====================
const openHistory = (item) => {
  setResult(item);
  setText(item.text);
};

// =====================
// DELETE SINGLE HISTORY
// =====================
const deleteHistory = (id) => {
  setHistory((prev) => prev.filter((item) => item.id !== id));
};

// =====================
// CLEAR ALL HISTORY
// =====================
const clearAllHistory = () => {
  const confirmDelete = window.confirm(
    "Yakin ingin menghapus semua history?"
  );

  if (confirmDelete) {
    setHistory([]);
    localStorage.removeItem("analysis_history");
  }
};

  return (
    <div
      className={`app ${
        darkMode ? "dark" : "light"
      }`}
    >
      <div className="glow glow-left" />
      <div className="glow glow-right" />

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="container navbar-content">
        
        <div className="brand">
 <div className="logo">
  <img
    src={logoAksara}
    alt="Aksara Sense"
  />
</div>

  <div className="brand-info">
    <h2>Aksara Sense</h2>
    <p>AI Text Assistant</p>
  </div>

  <div className="partner-logos">
    <img
      src="https://framerusercontent.com/assets/Tb6zvTvTwAnukX151zirV4dhkY.png"
      alt="PIJAK"
    />

    <img
      src="https://framerusercontent.com/images/C30iYueCL8Z1UA05ENDfd9Ro4.png?width=1158&height=846"
      alt="Dicoding"
    />
  </div>
</div>

          {/* SWITCH */}
          <div
            className={`theme-switch ${
              darkMode
                ? "active"
                : ""
            }`}
            onClick={() =>
              setDarkMode(
                !darkMode
              )
            }
          >
            <div className="switch-thumb" />
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero container">
        <div className="badge">
          ✨ Deep Learning Powered
        </div>

        <h1 className="hero-title">
          Sense The Error
          <br />
          <span>
            Preserve The Meaning
          </span>
        </h1>

        <p className="hero-subtitle">
          Platform AI berbasis
          Deep Learning untuk
          mendeteksi kesalahan
          penulisan Bahasa
          Indonesia secara cepat
          dan akurat.
        </p>

        <div className="hero-stats">
          <div className="stat-card">
            <h2>83%</h2>
            <p>Akurasi</p>
          </div>

          <div className="stat-card">
            <h2>BiLSTM</h2>
            <p>Model AI</p>
          </div>

          <div className="stat-card">
            <h2>
              {history.length}
            </h2>
            <p>Analisis</p>
          </div>
        </div>
      </section>

      {/* NEWS CAROUSEL */}
      <section className="container news-section">
        <h2 className="section-title">
          Insight Seputar AI
        </h2>

        <div className="news-carousel">
          <img
            src={
              newsSlides[
                newsIndex
              ].image
            }
            alt=""
            className="news-image"
          />

          <div className="news-content">
            <h3>
              {
                newsSlides[
                  newsIndex
                ].title
              }
            </h3>

            <p>
              {
                newsSlides[
                  newsIndex
                ].desc
              }
            </p>
          </div>
        </div>

        <div className="dots">
          {newsSlides.map(
            (_, i) => (
              <span
                key={i}
                className={
                  i === newsIndex
                    ? "dot active"
                    : "dot"
                }
              />
            )
          )}
        </div>
      </section>

      {/* ANALYSIS */}
      <section className="analysis container">
        <div className="analysis-grid">
          <div className="analysis-card">
            <h2>
              Analisis Teks
            </h2>
<div className="single-model-card">
  <h4>BiLSTM</h4>
  <span>Model Aktif</span>
</div>
            <textarea
              rows="10"
              className="text-input"
              value={text}
              onChange={(e) =>
                setText(
                  e.target.value
                )
              }
              placeholder="Masukkan teks..."
            />

            <div className="text-meta">
              <span>
                {text.length}
                {" "}karakter
              </span>

              <button
                className="clear-btn"
                onClick={
                  clearText
                }
              >
                Clear
              </button>
            </div>

            <button
              className="analyze-btn"
              onClick={
                analyzeText
              }
              disabled={
                loading
              }
            >
              {loading
                ? "Analyzing..."
                : "Cek Sekarang!"}
            </button>
          </div>

          <div className="result-panel">
            {!result ? (
              <div className="empty-state">
                <div className="empty-icon">
                  🤖
                </div>

                <h3>
                  Tunggu Analisis
                </h3>

                <p>
                  Masukkan
                  teks untuk
                  memulai
                  analisis.
                </p>
              </div>
            ) : (
<div className="result-box premium-result">
<h3>Hasil Analisis BiLSTM</h3>

<div className="result-badges">
  <span className="badge-error">
    {result.error_type}
  </span>

  <span className="badge-confidence">
    {(result.confidence * 100).toFixed(2)}%
  </span>
</div>

<p className="result-time">
  {result.time}
</p>

<div className="text-preview">
  {result.text}
</div>

<div className="result-description">
  <h4>Interpretasi Model</h4>

  <p>
    Sistem mendeteksi bahwa kalimat
    memiliki kecenderungan termasuk
    kategori <b>{result.error_type} </b>
    dengan tingkat keyakinan
    <b>
      {" "}
      {(result.confidence * 100).toFixed(2)}%
    </b>.
  </p>

  {currentError && (
    <>
      <hr
        style={{
          margin: "15px 0",
          opacity: 0.2,
        }}
      />

      <h4>
        {currentError.title}
      </h4>

      <p>
        {currentError.description}
      </p>
    </>
  )}
</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* HISTORY */}
     <section className="history container">
  <div className="history-header">
    <h2 className="section-title">
      Analisis Terbaru
    </h2>

    {history.length > 0 && (
      <button
        className="delete-all-btn"
        onClick={clearAllHistory}
      >
        🗑 Hapus Semua
      </button>
    )}
  </div>

  <div className="history-grid">
    {history.length === 0 ? (
      <p>Belum ada analisis.</p>
    ) : (
      history.map((h) => (
        <div
          key={h.id}
          className="history-card"
          onClick={() =>
            openHistory(h)
          }
        >
          <div className="history-top">
            <span>{h.model}</span>

            <div>
              <small>
                {h.time}
              </small>

              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteHistory(h.id);
                }}
              >
                🗑
              </button>
            </div>
          </div>

          <p>
            {h.text.slice(0, 100)}
            ...
          </p>
        </div>
      ))
    )}
  </div>
</section>

      {/* TEAM */}
      <section className="team container">
        <h2 className="section-title">
          Profil Tim Capstone
        </h2>

        <div className="team-slider">
          <div className="team-track">
            {[...team, ...team].map(
              (
                member,
                index
              ) => (
                <div
                  key={index}
                  className="team-card"
                >
                  <img
                    src={
                      member.img
                    }
                    alt={
                      member.name
                    }
                  />

                  <h3>
                    {
                      member.name
                    }
                  </h3>

                  <p>
                    {
                      member.role
                    }
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <footer className="footer">
        <h2>
          Aksara Sense
        </h2>

        <span>
         All rights reserved © 2026 Capstone Team | PJK-RM112
        </span>

        
        <p>
          PJK-RM112@student.devacademy.id
        </p>
      </footer>
    </div>
  );
}

