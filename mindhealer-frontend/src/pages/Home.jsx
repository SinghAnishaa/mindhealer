import React from "react";
import Testimonials from "../components/Testimonials";
import ContactUs from "../components/ContactUs";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-blue-600 text-white text-center p-10">
      {/* Hero Section */}
      <div className="mt-20"> {/* Add margin-top here to push below navbar */}
        <h1 className="text-4xl font-bold mb-4">
          Welcome to MindHealer 🧘‍♀️
        </h1>
        <p className="text-lg mb-6 max-w-2xl">
          A safe space to share your thoughts, connect with others, and access mental health support.
        </p>
        <div className="flex space-x-4">
          <a
            href="/forum"
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition"
          >
            Join the Forum
          </a>
          <a
            href="/therapists"
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition"
          >
            Book a Therapist
          </a>
        </div>
      </div>

    {/* Quick Access Section - Fixing Position */}
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-5 mt-16">
    <h2 className="text-xl font-bold text-center text-blue-600 mb-4">Quick Access</h2>
    
    {/* Forum Discussions */}
    <div className="mb-3">
        <h3 className="text-lg font-semibold">🗣️ Recent Forum Discussions</h3>
        <ul className="list-disc list-inside text-blue-500">
        <li><a href="/forum/post-1" className="hover:underline">How to handle stress?</a></li>
        <li><a href="/forum/post-2" className="hover:underline">Dealing with Anxiety</a></li>
        </ul>
    </div>

    {/* Therapist Booking */}
    <div className="mb-3">
        <h3 className="text-lg font-semibold">🩺 Therapist Booking</h3>
        <p className="text-sm text-gray-600">
        Need to talk? <a href="/therapists" className="text-blue-500 hover:underline">Book a therapist now.</a>
        </p>
    </div>

    {/* Chat Support */}
    <div>
        <h3 className="text-lg font-semibold">💬 Chat Support</h3>
        <p className="text-sm text-gray-600">
        Connect with a support group in real time. <a href="/chat" className="text-blue-500 hover:underline">Join the chat.</a>
        </p>
    </div>
    </div>




      {/* Mental Health Resources Section */}
      <div className="mt-12 bg-white text-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl">
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
      </div>
      
      {/* Testimonials Section */}
      <Testimonials />
      <ContactUs />
      <Footer />
      
    </div>
  );
};

export default Home;
