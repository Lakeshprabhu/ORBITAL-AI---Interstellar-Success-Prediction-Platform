import axios from "axios";

const BASE = "http://localhost:8000";

export const predictMission = (data) =>
  axios.post(`${BASE}/predict`, data);

export const askChatbot = (question) =>
  axios.post(`${BASE}/chat`, { question });
