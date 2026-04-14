import { useState, useRef, useEffect } from "react";
import { askChatbot } from "../api";

const SUGGESTED = [
  "What factors most affect launch success?",
  "Which organisation has the best success rate?",
  "How does mission cost relate to success?",
  "What is the ML model used in this project?",
  "Tell me about SpaceX launch history",
];

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const bottomRef               = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const question = (text || input).trim();
    if (!question || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: question }]);
    setLoading(true);
    try {
      const { data } = await askChatbot(question);
      setMessages(prev => [...prev, { role: "bot", text: data.answer }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "bot",
        text: "⚠️ Unable to reach the backend. Make sure FastAPI is running on port 8000.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <p className="section-eyebrow">RAG-Powered Intelligence</p>
        <h2 className="section-title">Space Mission Analyst</h2>
        <p className="section-desc">
          Ask anything about the dataset, the analysis, or the ML model.
        </p>
      </div>

      <div className="chat-wrap">
        {/* Messages */}
        <div className="chat-messages">
          {messages.length === 0 && !loading && (
            <div className="chat-empty">
              <span className="chat-empty-icon">🛸</span>
              <span>Ask me anything about space missions</span>
              <div className="suggested-grid">
                {SUGGESTED.map((q) => (
                  <button
                    key={q}
                    className="suggest-chip"
                    onClick={() => sendMessage(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            msg.role === "user"
              ? <div key={i} className="chat-bubble bubble-user">{msg.text}</div>
              : (
                <div key={i} className="chat-bubble bubble-bot">
                  <div className="bot-label">🤖 Orbital AI</div>
                  {msg.text}
                </div>
              )
          ))}

          {loading && (
            <div className="chat-bubble bubble-bot bubble-loading">
              <div className="dot-pulse">
                <span /><span /><span />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input row */}
        <div className="chat-input-row">
          <input
            className="chat-input"
            placeholder="Ask about space missions, launch data, or the ML model…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={loading}
          />
          <button
            className="chat-send-btn"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            title="Send"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
