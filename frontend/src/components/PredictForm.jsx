import { useState } from "react";
import { predictMission } from "../api";

const ORG_COUNTRY_MAP = {
  CASC: ["CHN"], NASA: ["USA"], ULA: ["USA"], Arianespace: ["FRA"],
  Northrop: ["USA"], SpaceX: ["USA"], ISRO: ["IND"], MHI: ["JPN"],
  "VKS RF": ["RUS"], "US Air Force": ["USA"], Roscosmos: ["RUS"],
  Kosmotras: ["RUS", "KAZ"], "Rocket Lab": ["NZL", "USA"],
  Eurockot: ["FRA", "RUS"], ILS: ["RUS", "USA"], "Martin Marietta": ["USA"],
  Lockheed: ["USA"], Boeing: ["USA"], JAXA: ["JPN"], "RVSN USSR": ["RUS"],
  ExPace: ["CHN"], "Virgin Orbit": ["USA"], Sandia: ["USA"],
  ESA: ["FRA"], EER: ["USA"],
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const COUNTRY_NAMES = {
  USA: "America", CHN: "China", IND: "India", RUS: "Russia",
  FRA: "France", JPN: "Japan", NZL: "New Zealand", KAZ: "Kazakhstan",
};

const RESULT_META = {
  "Success": { cls: "result-success", badge: "badge-success", icon: "✅", emoji: "🎉" },
  "Failure": { cls: "result-failure", badge: "badge-failure", icon: "❌", emoji: "💥" },
  "Partial Failure": { cls: "result-partial", badge: "badge-partial", icon: "⚠️", emoji: "🔶" },
  "Prelaunch Failure": { cls: "result-prelaunch", badge: "badge-prelaunch", icon: "🚫", emoji: "🛑" },
};

export default function PredictForm() {
  const [org, setOrg] = useState("SpaceX");
  const [country, setCountry] = useState(ORG_COUNTRY_MAP["SpaceX"][0]);
  const [month, setMonth] = useState("Jan");
  const [price, setPrice] = useState("");
  const [rocketStatus, setRocket] = useState(1);
  const [year, setYear] = useState(2024);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleOrgChange = (val) => {
    setOrg(val);
    const countries = ORG_COUNTRY_MAP[val] || [];
    setCountry(countries[0] || "");
  };

  const handleSubmit = async () => {
    if (!price) { setError("Please enter a price."); return; }
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const { data } = await predictMission({
        organisation: org,
        country,
        month,
        price: parseFloat(price),
        rocket_status: rocketStatus,
        year: parseInt(year),
      });
      setResult(data);
    } catch (e) {
      setError("Failed to connect to backend. Is FastAPI running on port 8000?");
    } finally {
      setLoading(false);
    }
  };

  const meta = result ? RESULT_META[result.result] || {} : {};

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <p className="section-eyebrow">ML-Powered Analysis</p>
        <h2 className="section-title">Mission Success Predictor</h2>
        <p className="section-desc">
          Enter mission parameters and our model will predict the launch outcome.
        </p>
      </div>

      <div className="card">
        <div className="form-grid">

          {/* Organisation */}
          <div className="form-field">
            <label className="form-label">Organisation</label>
            <select
              className="form-select"
              value={org}
              onChange={e => handleOrgChange(e.target.value)}
            >
              {Object.keys(ORG_COUNTRY_MAP).map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          {/* Country */}
          <div className="form-field">
            <label className="form-label">Country</label>
            <select
              className="form-select"
              value={country}
              onChange={e => setCountry(e.target.value)}
            >
              {(ORG_COUNTRY_MAP[org] || []).map(c => (
                <option key={c} value={c}>{COUNTRY_NAMES[c] || c} ({c})</option>
              ))}
            </select>
          </div>

          {/* Month */}
          <div className="form-field">
            <label className="form-label">Launch Month</label>
            <select
              className="form-select"
              value={month}
              onChange={e => setMonth(e.target.value)}
            >
              {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {/* Year */}
          <div className="form-field">
            <label className="form-label">Launch Year</label>
            <input
              className="form-input"
              type="number"
              min={1950}
              max={2100}
              value={year}
              onChange={e => setYear(e.target.value)}
            />
          </div>

          {/* Price */}
          <div className="form-field">
            <label className="form-label">Mission Cost ($ millions)</label>
            <input
              className="form-input"
              type="number"
              min={0}
              step={0.01}
              placeholder="e.g. 62.5"
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
          </div>

          {/* Rocket Status */}
          <div className="form-field">
            <label className="form-label">
              Rocket Status —&nbsp;
              <span style={{ color: rocketStatus === 1 ? "var(--accent-green)" : "var(--accent-red)", fontWeight: 700 }}>
                {rocketStatus === 1 ? "Active 🟢" : "Discontinued 🔴"}
              </span>
            </label>
            <div className="slider-wrap">
              <input
                type="range"
                min={0} max={1} step={1}
                value={rocketStatus}
                onChange={e => setRocket(parseInt(e.target.value))}
              />
              <div className="slider-labels">
                <span>Discontinued</span>
                <span>Active</span>
              </div>
            </div>
          </div>

        </div>

        {error && (
          <p style={{ color: "var(--accent-red)", fontSize: "0.82rem", marginTop: "1.2rem", fontFamily: "'JetBrains Mono', monospace" }}>
            ⚠ {error}
          </p>
        )}

        <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? <><div className="spinner" /> Analyzing Mission…</> : <><span>🚀</span> PREDICT OUTCOME</>}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className={`result-card ${meta.cls}`}>
          <div className={`result-badge ${meta.badge}`}>
            <span>{meta.icon}</span> {result.result}
          </div>
          <p className="result-summary" dangerouslySetInnerHTML={{ __html: formatSummary(result.summary) }} />
        </div>
      )}
    </div>
  );
}

function formatSummary(text) {
  // Bold key terms
  return text
    .replace(/(SpaceX|NASA|ISRO|ESA|Roscosmos|Arianespace|ULA|JAXA|Boeing|Lockheed|Northrop|Rocket Lab|Kosmotras|ExPace|CASC|MHI|VKS RF|Virgin Orbit|EER|ILS)/g, "<strong>$1</strong>")
    .replace(/(\$[\d,.]+\s*million)/g, "<strong>$1</strong>")
    .replace(/(Success|Failure|Partial Failure|Prelaunch Failure)/g, "<strong>$1</strong>")
    .replace(/(currently in use|discontinued)/g, "<strong>$1</strong>");
}
