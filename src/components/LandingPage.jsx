import React, { useState } from "react";

export default function LandingPage({ setPage }) {
  const [showAbout, setShowAbout] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);


  return (
    
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",  // center horizontally
        alignItems: "center",      // center vertically
        background: "linear-gradient(135deg,#0f172a,#1e293b)",
        color: "#f5f7fa",
        fontFamily: "'Segoe UI', sans-serif",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* ✅ Centered container */}
      <div
        style={{
          maxWidth: "1000px",   // controls width of content
          width: "100%",
          textAlign: "center", // centers text inside
          margin: "0 auto",
        }}
      >
        {/* Hero Section */}
        <h1
          style={{
            fontSize: "4rem",
            fontWeight: 800,
            marginBottom: "20px",
            textShadow: "3px 3px 15px rgba(0,0,0,0.7)",
          }}
        >
          Fraud Detection Dashboard
        </h1>

        <p
          style={{
            fontSize: "1.5rem",
            maxWidth: "700px",
            margin: "0 auto 40px",
            color: "#cbd5e1",
            textShadow: "1px 1px 5px rgba(0,0,0,0.6)",
          }}
        >
          Real-time AI-powered transaction analysis. Detect fraud instantly with interactive charts and insights.
        </p>

        {/* Get Started Button */}
        {/* Buttons Container */}
<div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "center", marginBottom: "40px" }}>
  {/* Get Started Button */}
  <button
    onClick={() => setPage("Dashboard")}
    style={{
      background: "linear-gradient(135deg,#2563eb,#1e40af)",
      color: "white",
      border: "none",
      borderRadius: "12px",
      padding: "15px 35px",
      fontSize: "1.2rem",
      fontWeight: 700,
      cursor: "pointer",
      boxShadow: "0 8px 25px rgba(0,0,0,0.5)",
      transition: "all 0.3s ease",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
  >
    Get Started →
  </button>

  {/* Download Demo CSV Button */}
  <button
    style={{
      padding: "12px 35px",
      background: "#10b981",
      border: "none",
      borderRadius: "12px",
      color: "white",
      fontWeight: 700,
      cursor: "pointer",
      boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
      transition: "all 0.3s ease",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
  >
    <a
      href="/transactions.csv"
      download
      style={{ color: "white", textDecoration: "none" }}
    >
      Download Demo CSV
    </a>
  </button>
</div>


        {/* Features Section */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "40px",
            margin: "40px auto",
          }}
        >
          {[
            {
              title: "Real-Time Detection",
              desc: "Analyze transactions instantly and flag suspicious activity.",
            },
            {
              title: "Interactive Charts",
              desc: "Visualize fraud trends professionally with smooth animations.",
            },
            {
              title: "Privacy First",
              desc: "All analysis runs locally. Your data never leaves your machine.",
            },
          ].map((f, idx) => (
            <div
              key={idx}
              style={{
                background: "linear-gradient(145deg,#111827,#1e293b)",
                padding: "25px 30px",
                borderRadius: "20px",
                minWidth: "250px",
                textAlign: "center",
                boxShadow: "0 8px 25px rgba(0,0,0,0.7)",
                transition: "all 0.3s",
                flex: "1 1 250px",
                maxWidth: "280px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform =
                  "translateY(-5px) scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <h3 style={{ color: "#38bdf8", marginBottom: "10px" }}>
                {f.title}
              </h3>
              <p style={{ color: "#cbd5e1", fontSize: "0.95rem" }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: "80px" }}>
          <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
            © 2025 Fraud Detection Dashboard |{" "}
            <span
              onClick={() => setShowAbout(!showAbout)}
              style={{ color: "#38bdf8", cursor: "pointer", textDecoration: "underline" }}
            >
              About
            </span>{" "}
            |{" "}
            <span
              onClick={() => setShowPrivacy(!showPrivacy)}
              style={{ color: "#38bdf8", cursor: "pointer", textDecoration: "underline" }}
            >
              Privacy
            </span>{" "}
            |{" "}
            <a
              href="mailto:keerthikanimmagadda@gmail.com"
              style={{ color: "#38bdf8", textDecoration: "none" }}
            >
              Mail us
            </a>{" "}
            | +91-9347664937
          </p>
        </div>

        {/* About Section */}
        {showAbout && (
          <div
            style={{
              marginTop: "20px",
              background: "#1e293b",
              padding: "20px",
              borderRadius: "12px",
              maxWidth: "700px",
              color: "#f5f7fa",
              textAlign: "left",
              boxShadow: "0 8px 25px rgba(0,0,0,0.7)",
              margin: "20px auto",
            }}
          >
            <h3>About</h3>
            <p>
              The Fraud Detection Dashboard is designed to help users analyze and detect suspicious transactions
              in real-time. Using interactive charts and AI-powered insights, it allows better visibility into
              financial activity for businesses and individuals.
            </p>
          </div>
        )}

        {/* Privacy Section */}
        {showPrivacy && (
          <div
            style={{
              marginTop: "20px",
              background: "#1e293b",
              padding: "20px",
              borderRadius: "12px",
              maxWidth: "700px",
              color: "#f5f7fa",
              textAlign: "left",
              boxShadow: "0 8px 25px rgba(0,0,0,0.7)",
              margin: "20px auto",
            }}
          >
            <h3>Privacy Policy</h3>
            <p>
              All transaction data is processed locally in your browser. No personal or financial data is sent
              to any server, ensuring complete privacy and security while using this dashboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
