import { useState } from "react";
import LoadingScreen from "./components/LoadingScreen";
import PredictForm from "./components/PredictForm";
import ChatBot from "./components/ChatBot";
import "./index.css";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState("predict");

  if (loading) {
    return <LoadingScreen onDone={() => setLoading(false)} />;
  }


  return (
    <div className="app-shell">
      {/* Star field background */}
      <div className="stars" aria-hidden="true">
        {Array.from({ length: 120 }).map((_, i) => (
          <span key={i} className="star" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            opacity: Math.random() * 0.7 + 0.2,
          }} />
        ))}
      </div>

      {/* Header */}
      <header className="site-header">
        <div className="header-inner">
          <div className="logo-group">
            <span className="logo-icon">🛸</span>
            <div>
              <h1 className="logo-title">ORBITALX<span className="accent">.</span>AI</h1>
              <p className="logo-sub">Space Mission Intelligence Platform</p>
            </div>
          </div>
          <nav className="tab-nav">
            <button
              className={`tab-btn ${tab === "predict" ? "active" : ""}`}
              onClick={() => setTab("predict")}
            >
              <span className="tab-icon">🚀</span> Mission Predictor
            </button>
            <button
              className={`tab-btn ${tab === "chat" ? "active" : ""}`}
              onClick={() => setTab("chat")}
            >
              <span className="tab-icon">🤖</span> AI Analyst
            </button>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="main-content">
        <div className={`tab-panel ${tab === "predict" ? "visible" : "hidden"}`}>
          <PredictForm />
        </div>
        <div className={`tab-panel ${tab === "chat" ? "visible" : "hidden"}`}>
          <ChatBot />
        </div>
      </main>

      <footer className="site-footer">
        <p>Powered by FastAPI · LangChain · OpenAI · FAISS</p>
      </footer>
    </div>
  );
}
