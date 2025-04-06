import React, { useContext, useState } from "react";
import Testimonials from "../components/Testimonials";
import ContactUs from "../components/ContactUs";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const Home = () => {
  const { user, authToken } = useContext(AuthContext);
  const [selectedMood, setSelectedMood] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleMoodSubmit = async (mood) => {
    setSelectedMood(mood);
    setIsSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/dashboard/mood`,
        { mood },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      alert("✅ Mood submitted successfully!");
    } catch (err) {
      console.error("❌ Error submitting mood:", err);
      alert("Failed to submit mood. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-blue-600 text-white text-center p-10 space-y-12">
      {/* Hero Section */}
      <section className="mt-20">
        <h1 className="text-4xl font-bold mb-4">Welcome to MindHealer 🧘‍♀️</h1>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          A safe space to share your thoughts, connect with others, and access mental health support.
        </p>
        <div className="flex space-x-4 justify-center">
          <a href="/forum" className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition">
            Join the Forum
          </a>
          <a href="/therapists" className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition">
            Book a Therapist
          </a>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl">
        {[
          { icon: "🧠", title: "AI-Powered Insights", desc: "Personalized mental health tips based on your mood." },
          { icon: "📔", title: "Private Journaling", desc: "Log your thoughts daily and reflect on your growth." },
          { icon: "💬", title: "Community Support", desc: "Engage with others in the safe MindHealer Forum." },
        ].map((f, i) => (
          <div key={i} className="bg-white text-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-2xl">{f.icon}</h3>
            <h4 className="text-lg font-semibold mt-2">{f.title}</h4>
            <p className="text-sm text-gray-600">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Mood Check-in */}
      {user && (
        <section className="bg-white text-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl">
          <h2 className="text-xl font-bold text-blue-600 mb-4">💡 How are you feeling today?</h2>
          <div className="flex justify-center space-x-3">
            {["😊", "😐", "😢", "😠", "😴"].map((mood, index) => (
              <button
                key={index}
                disabled={isSubmitting}
                className={`text-3xl transition-transform ${selectedMood === mood ? 'scale-125' : 'hover:scale-110'}`}
                onClick={() => handleMoodSubmit(mood)}
              >
                {mood}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Dashboard Redirect */}
      {user && (
        <section className="bg-white text-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl">
          <h2 className="text-xl font-bold text-blue-600 mb-4">📈 Your Wellness Overview</h2>
          <p className="text-sm text-gray-600 mb-3">View your recent moods, journaling insights, and personalized resources.</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
        </section>
      )}

      {/* Chatbot Section */}
      <section className="bg-white text-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold text-blue-600 mb-4">🤖 Ask MindHealer</h2>
        <p className="text-sm text-gray-600 mb-3">Have a question on mental wellness?</p>
        <input
          type="text"
          placeholder="e.g., How to deal with anxiety?"
          className="w-full p-2 border rounded mb-3"
          disabled
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => navigate('/chat')}>
          Try the Chatbot
        </button>
      </section>

      {/* Quick Access */}
      <section className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-5">
        <h2 className="text-xl font-bold text-center text-blue-600 mb-4">Quick Access</h2>
        <div className="mb-3">
          <h3 className="text-lg font-semibold">🗣️ Recent Forum Discussions</h3>
          <ul className="list-disc list-inside text-blue-500">
            <li><a href="/forum/post-1" className="hover:underline">How to handle stress?</a></li>
            <li><a href="/forum/post-2" className="hover:underline">Dealing with Anxiety</a></li>
          </ul>
        </div>
        <div className="mb-3">
          <h3 className="text-lg font-semibold">🩺 Therapist Booking</h3>
          <p className="text-sm text-gray-600">Need to talk? <a href="/therapists" className="text-blue-500 hover:underline">Book a therapist now.</a></p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">💬 Chat Support</h3>
          <p className="text-sm text-gray-600">Connect with a support group in real time. <a href="/chat" className="text-blue-500 hover:underline">Join the chat.</a></p>
        </div>
      </section>

      {/* Mental Health Resources */}
      <section className="bg-white text-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Mental Health Resources</h2>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">🧘 Meditation Guides</h3>
          <ul className="list-disc list-inside text-sm text-gray-600">
            <li><a href="https://www.headspace.com/meditation" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Beginner's Meditation</a></li>
            <li><a href="https://www.calm.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Guided Mindfulness</a></li>
          </ul>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">🌿 Stress Management</h3>
          <ul className="list-disc list-inside text-sm text-gray-600">
            <li><a href="https://www.verywellmind.com/how-to-relieve-stress-3145086" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Top Stress Relief Strategies</a></li>
            <li><a href="https://www.apa.org/topics/stress" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">APA: Managing Stress</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold">📖 Mental Health Articles</h3>
          <ul className="list-disc list-inside text-sm text-gray-600">
            <li><a href="https://www.nimh.nih.gov/health/topics" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">National Institute of Mental Health</a></li>
            <li><a href="https://www.mhanational.org/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Mental Health America</a></li>
          </ul>
        </div>
      </section>

      <Testimonials />
      <ContactUs />
      <Footer />
    </div>
  );
};

export default Home;
