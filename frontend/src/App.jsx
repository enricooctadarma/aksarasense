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
  const [result, setResult] = useState([]);
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
    id: "APC005D6Y0498",
    img: nicholas
  },
  {
    name: "Dikri Pajar Alip Nurrohman",
    role: "AI Engineer",
    id: "APC012D6Y0486",
    img: dikry
  },
  {
    name: "Enrico Octadarma Hulu",
    role: "AI Engineer",
    id: "APC917D6Y0520",
    img: enrico
  },
];

  useEffect(() => {
    const interval = setInterval(() => {
      setNewsIndex((prev) => (prev + 1) % newsSlides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        "analysis_history"
      );

      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "analysis_history",
      JSON.stringify(history)
    );
  }, [history]);

  const analyzeText = async () => {
  if (!text.trim()) return;

  setLoading(true);

  try {
    const sentences = text
      .split(".")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const results = [];

    for (let s of sentences) {
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        text: s,
      });

      const data = response.data;
const isWrong = data.status === "Salah";

if (isWrong) {
  results.push({
    id: Date.now() + Math.random(),
    text: s,
    error_type: data.error_type,
    confidence: data.confidence,
    status: data.status,
    probabilities: data.probabilities,
    sequence: data.sequence,
    time: new Date().toLocaleTimeString(),
  });
}
    }

    setResult(results);
    setHistory((prev) => [...results, ...prev]);
  } catch (error) {
    console.error(error);
    alert("Gagal terhubung ke backend");
  } finally {
    setLoading(false);
  }
};

  const clearText = () => {
    setText("");
    setResult([]);
  };
  const openHistory = (item) => {
  setResult([item]);
  setText(item.text);
};

const deleteHistory = (id) => {
  setHistory((prev) =>
    prev.filter(
      (item) => item.id !== id
    )
  );
};

const clearAllHistory = () => {
  if (
    window.confirm(
      "Yakin ingin menghapus semua history?"
    )
  ) {
    setHistory([]);
    localStorage.removeItem(
      "analysis_history"
    );
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

    {/* INPUT PANEL */}
    <div className="analysis-card">

      {/* HEADER */}
      <div className="analysis-header">
        <h2>Analisis Teks</h2>
      </div>

      {/* MODEL STATUS */}
      <div className="model-status">
        <div className="status-dot" />
        <span>BiLSTM • Active Model</span>
      </div>

      {/* INSTRUCTION */}
      <div className="input-guide">
        <p>
          ⚠️ <b>Petunjuk Input:</b> 1 kalimat harus diakhiri dengan titik (.)
          dan jika lebih dari 1 kalimat, pisahkan dengan <b>titik + spasi (. )</b>
        </p>
      </div>

      {/* INPUT */}
      <textarea
        rows="10"
        className="text-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Masukkan teks yang ingin dianalisis..."
      />

      {/* META */}
      <div className="text-meta">
        <span>{text.length} karakter</span>

        <button className="clear-btn" onClick={clearText}>
          Clear
        </button>
      </div>

      {/* ACTION */}
      <button
        className="analyze-btn"
        onClick={analyzeText}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Mulai Analisis"}
      </button>

    </div>

    {/* RESULT PANEL */}
    <div className="result-panel">

      {/* EMPTY STATE */}
      {!Array.isArray(result) || result.length === 0 ? (
        <div className="empty-state">

          <div className="empty-icon">🤖</div>

          <h3>Menunggu Input</h3>

          <p>
            Masukkan kalimat untuk melihat deteksi kesalahan oleh model BiLSTM
          </p>

          <div className="hint-box">
            Contoh: <b>"Saya pegi ke sekolah kemarin."</b>
          </div>

        </div>
      ) : (

        <div className="result-box premium-result">

          {/* RESULT HEADER */}
          <div className="result-header">
            <h3>Hasil Analisis</h3>
            <span className="result-count">
              {result.length} kalimat dianalisis
            </span>
          </div>

          {/* RESULT LIST */}
          <div className="text-preview">

            {result.map((r, index) => {
              const isWrong = r.status === "Salah";

              return (
                <div
                  key={r.id}
                  className={`result-card ${isWrong ? "wrong" : "correct"}`}
                >

                  {/* STATUS ROW */}
                  <div className="result-top">

                    {/* STATUS BADGE */}
                    <span className={`status-badge ${isWrong ? "wrong" : "correct"}`}>
                      {r.status === "Salah" ? "Salah" : "Benar"}
                    </span>

                    {/* CONFIDENCE */}
                    <span className="confidence">
                      {(r.confidence * 100).toFixed(2)}%
                    </span>

                  </div>

                  {/* TEXT */}
                  <div className="analysis-text">
                    <span className={isWrong ? "error-underline" : ""}>
                      {r.text}
                    </span>
                  </div>

                  {/* ERROR TYPE */}
                  <div className="error-type">
                    {r.error_type}
                  </div>

                  {/* NUMBERING ONLY FOR WRONG SENTENCES */}
                  {isWrong && (
                    <div className="error-number">
                      Kesalahan #{index + 1}
                    </div>
                  )}

                </div>
              );
            })}

          </div>

          {/* FOOTER */}
          <div className="result-description">
            <h4>Interpretasi Model</h4>
            <p>
              Model BiLSTM menganalisis setiap kalimat secara independen
              untuk mendeteksi kesalahan penulisan Bahasa Indonesia.
            </p>
          </div>

        </div>
      )}

    </div>

  </div>
</section>

{/* HISTORY */}
<section className="history container">
  <div className="history-header">
    <h2 className="section-title">Riwayat Analisis</h2>

    {history.length > 0 && (
      <button className="delete-all-btn" onClick={clearAllHistory}>
        🗑 Hapus Semua
      </button>
    )}
  </div>

  {/* SCROLL AREA */}
  <div className="history-scroll">

    {history.length === 0 ? (
      <p className="empty-history">Belum ada analisis.</p>
    ) : (

      history.map((h) => {

        const preview =
          h.text?.length > 90
            ? h.text.slice(0, 90) + "..."
            : h.text || "-";

        return (
          <div
            key={h.id}
            className="history-card"
            onClick={() => openHistory(h)}
          >

            {/* TOP */}
            <div className="history-top">

              <span className="history-model">
                {h.model || "BiLSTM"}
              </span>

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

            {/* TEXT */}
            <p className="history-text">
              {preview}
            </p>

          </div>
        );
      })

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

               


<span className="team-id">
  {member.id}
</span>

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

