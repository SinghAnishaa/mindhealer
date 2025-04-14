import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Container } from "../components/ui/container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
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
import { Smile, Meh, Frown, Angry, Moon, BarChart, Book, CalendarClock } from "lucide-react";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const moodToScore = {
  'happy': 5,
  'neutral': 3,
  'sad': 2,
  'angry': 1,
  'tired': 0
};

const wordToEmoji = {
  'happy': '😊',
  'neutral': '😐',
  'sad': '😢',
  'angry': '😠',
  'tired': '😴'
};

const moodEmojis = {
  "😊": { score: 5, label: "Happy", icon: Smile },
  "😐": { score: 3, label: "Neutral", icon: Meh },
  "😢": { score: 2, label: "Sad", icon: Frown },
  "😠": { score: 1, label: "Angry", icon: Angry },
  "😴": { score: 0, label: "Tired", icon: Moon },
};

const Dashboard = () => {
  const [snapshot, setSnapshot] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [mood, setMood] = useState("");
  const [journal, setJournal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      
      // Format data before setting state
      const formattedData = {
        ...res.data,
        startDate: `${res.data.daysSinceStart} days ago`,
        averageMood: res.data.averageMood || "No entries yet",
        moodTrend: res.data.moodTrend || "No entries yet",
        averageMoodExplanation: res.data.averageMoodExplanation || "No explanation available",
        recentMoods: res.data.recentMoods || []
      };

      setSnapshot(formattedData);

      // Process mood data for the chart
      if (res.data.allMoods && res.data.allMoods.length > 0) {
        // Group entries by date
        const entriesByDate = res.data.allMoods.reduce((acc, entry) => {
          const date = new Date(entry.createdAt).toLocaleDateString();
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(entry);
          return acc;
        }, {});

        // Calculate average mood score for each date
        const sortedDates = Object.keys(entriesByDate).sort((a, b) => 
          new Date(a) - new Date(b)
        );

        const averageScores = sortedDates.map(date => {
          const entries = entriesByDate[date];
          const totalScore = entries.reduce((sum, entry) => sum + moodToScore[entry.mood], 0);
          return totalScore / entries.length;
        });

        setChartData({
          labels: sortedDates,
          datasets: [
            {
              label: "Daily Average Mood",
              data: averageScores,
              fill: false,
              borderColor: "#3b82f6",
              backgroundColor: "#93c5fd",
              pointBackgroundColor: "#1d4ed8",
              pointRadius: 5,
              tension: 0.4,
            },
          ],
        });
      }
    } catch (err) {
      console.error("Error fetching dashboard snapshot:", err);
    }
  };

  useEffect(() => {
    fetchSnapshot();
  }, []);

  const handleMoodSubmit = async (e) => {
    e.preventDefault();
    if (!mood) {
      alert("Please select a mood emoji before submitting.");
      return;
    }

    setIsSubmitting(true);
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
        alert("Mood and journal saved successfully!");
        setJournal("");
        setMood("");
        fetchSnapshot();
      }
    } catch (error) {
      console.error("Error submitting mood/journal:", error);
      alert("Error saving mood/journal entry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!snapshot || !chartData) {
    return (
      <Container className="py-8">
        <div className="text-center">Loading dashboard...</div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Your Wellness Dashboard</h1>
          <BarChart className="h-8 w-8 text-blue-600" />
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <CalendarClock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Tracking Since</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {snapshot.startDate}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Smile className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Mood</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {snapshot.averageMood} ({snapshot.averageMoodExplanation})
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <BarChart className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Mood Trend</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {snapshot.moodTrend}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Book className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Journal Entries</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {snapshot.totalEntries}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mood Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Mood Trends</CardTitle>
            <CardDescription>Track your emotional well-being over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 5,
                      ticks: {
                        stepSize: 1,
                        callback: (value) => {
                          const labels = ["Tired", "Angry", "Sad", "Neutral", "Happy"];
                          return labels[value] || value;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Mood Entry Form */}
        <Card>
          <CardHeader>
            <CardTitle>How are you feeling today?</CardTitle>
            <CardDescription>Track your mood and journal your thoughts</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleMoodSubmit} className="space-y-4">
              <div className="flex justify-center space-x-6">
                {Object.entries(moodEmojis).map(([emoji, { label, icon: Icon }]) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setMood(emoji)}
                    className={`p-3 rounded-full transition-all ${
                      mood === emoji
                        ? "bg-blue-100 scale-110"
                        : "hover:bg-gray-100 hover:scale-105"
                    }`}
                  >
                    <Icon
                      className={`h-8 w-8 ${
                        mood === emoji ? "text-blue-600" : "text-gray-600"
                      }`}
                    />
                    <span className="sr-only">{label}</span>
                  </button>
                ))}
              </div>

              <textarea
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                placeholder="Write your thoughts here..."
                className="input min-h-[100px] w-full"
              />

              <Button
                type="submit"
                disabled={!mood || isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Saving..." : "Save Entry"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Entries */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
            <CardDescription>Your latest mood and journal entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {snapshot.recentMoods.map((entry, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{wordToEmoji[entry.mood] || entry.mood}</span>
                      <span className="text-sm text-gray-600">
                        {new Date(entry.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {entry.journal && (
                    <p className="text-gray-700 whitespace-pre-wrap">{entry.journal}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default Dashboard;


