// making chnages

// now
// Dashboard.jsx - Full Updated Version
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const moodScore = (mood) => {
  const emojiMap = {
    "😊": { score: 5, label: "Happy" },
    "😐": { score: 3, label: "Neutral" },
    "😢": { score: 2, label: "Sad" },
    "😠": { score: 1, label: "Angry" },
    "😴": { score: 0, label: "Tired" },
    happy: { score: 5, label: "Happy" },
    neutral: { score: 3, label: "Neutral" },
    sad: { score: 2, label: "Sad" },
    angry: { score: 1, label: "Angry" },
    tired: { score: 0, label: "Tired" },
  };
  return emojiMap[mood] || { score: 2.5, label: "Unknown" };
};

const Dashboard = () => {
  const [snapshot, setSnapshot] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [mood, setMood] = useState("");
  const [journal, setJournal] = useState("");

  const fetchSnapshot = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/dashboard/snapshot`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setSnapshot(res.data);

      const labels = res.data.recentMoods.map((e) =>
        new Date(e.createdAt).toLocaleDateString()
      );
      const data = res.data.recentMoods.map((e) => moodScore(e.mood).score);

      setChartData({
        labels,
        datasets: [
          {
            label: "Mood Score Over Time",
            data,
            fill: false,
            borderColor: "#3b82f6",
            backgroundColor: "#93c5fd",
            pointBackgroundColor: "#1d4ed8",
            pointRadius: 5,
            tension: 0.4,
          },
        ],
      });
    } catch (err) {
      console.error("❌ Error fetching dashboard snapshot:", err);
    }
  };

  useEffect(() => {
    fetchSnapshot();
  }, []);

  const handleMoodSubmit = async (e) => {
    e.preventDefault();
  
    if (!mood) {
      alert("⚠️ Please select a mood emoji before submitting.");
      return;
    }
  
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/dashboard/mood`,
        {
          mood,
          journal,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
  
      if (res.status === 201) {
        alert("✅ Mood and journal saved successfully!");
        setJournal("");
        setMood(""); // Clear after saving
        fetchSnapshot(); // Refresh dashboard
      }
    } catch (error) {
      console.error("❌ Error submitting mood/journal:", error.response?.data || error.message);
      alert("Error saving mood/journal entry.");
    }
  };
  

  if (!snapshot || !chartData)
    return <div className="text-center mt-10">Loading dashboard...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">📊 Wellness Dashboard</h1>

      {/* Mood Submission Form */}
      <form onSubmit={handleMoodSubmit} className="mb-8">
        <h2 className="text-xl font-semibold mb-2">😌 Submit Your Mood</h2>
        <div className="flex items-center space-x-2 mb-2">
          {["😊", "😐", "😢", "😠", "😴"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMood(m)}
              className={`text-2xl px-3 py-2 rounded-full border ${
                mood === m ? "bg-blue-100 border-blue-500" : "border-gray-300"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <textarea
          placeholder="Write about your day..."
          className="w-full p-2 border border-gray-300 rounded mb-3"
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
        ></textarea>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Save Mood
        </button>
      </form>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">🧘 Recent Mood Entries</h2>
        {snapshot.recentMoods.map((entry, index) => (
          <div key={index} className="border-l-4 pl-3 mb-3 border-blue-400">
            <p>
              <strong>Mood:</strong> {entry.mood}
            </p>
            <p>
              <strong>Journal:</strong> {entry.journal || "—"}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(entry.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">📈 Mood Trend</h2>
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { display: true },
              tooltip: { enabled: true },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 5,
                ticks: { stepSize: 1 },
              },
            },
          }}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">💡 Journal Prompt</h2>
        <p className="italic text-gray-700">{snapshot.journalPrompt}</p>
      </div>
    </div>
  );
};

export default Dashboard;