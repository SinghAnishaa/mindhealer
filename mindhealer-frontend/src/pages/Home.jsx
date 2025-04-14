import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Container } from "../components/ui/container";
import { Heart, MessageCircle, Brain, Users, ArrowRight } from "lucide-react";
import Testimonials from "../components/Testimonials";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [selectedMood, setSelectedMood] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const features = [
    { 
      icon: Brain, 
      title: "AI-Powered Mental Health Support",
      desc: "Get personalized support and insights through our advanced AI chatbot."
    },
    { 
      icon: MessageCircle, 
      title: "Safe Space to Express",
      desc: "Journal your thoughts and feelings in a private, secure environment."
    },
    { 
      icon: Users, 
      title: "Supportive Community",
      desc: "Connect with others who understand your journey in our moderated forums."
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-blue-50 to-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Journey to Mental Wellness Starts Here
            </h1>
            <p className="text-xl mb-8 text-gray-600 leading-relaxed">
              Experience a holistic approach to mental health with AI-powered support, 
              professional guidance, and a caring community.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => navigate("/signup")}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={() => navigate("/about")}
                variant="outline"
                size="lg"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8"
              >
                Learn More
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose MindHealer?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We combine technology and human touch to provide you with comprehensive mental health support.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600">{feature.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Mood Check-in and Resources Section */}
      {user && (
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Mood Check-in Card */}
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">How are you feeling today?</CardTitle>
                  <CardDescription>Track your mood and see personalized insights on your dashboard</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-center space-x-6">
                    {["😊", "😐", "😢", "😠", "😴"].map((mood) => (
                      <button
                        key={mood}
                        onClick={() => setSelectedMood(mood)}
                        disabled={isSubmitting}
                        className={`text-4xl transition-all duration-200 hover:scale-110 ${
                          selectedMood === mood ? "scale-125 border-b-2 border-blue-600" : ""
                        }`}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">Visit your dashboard to track your moods, journal entries, and see personalized analytics</p>
                    <Button
                      onClick={() => navigate("/dashboard")}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Go to Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Mental Health Resources Card */}
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🧘</span>
                    Mental Health Resources
                  </CardTitle>
                  <CardDescription>Access curated resources to support your mental health journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {resourceLinks.meditation.map((link, index) => (
                      <li key={index}>
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </Container>
        </section>
      )}

      <Testimonials />
    </div>
  );
};

// Resource links data
const resourceLinks = {
  meditation: [
    { title: "Beginner's Guide to Meditation", url: "https://www.headspace.com/meditation" },
    { title: "Mindfulness Practices", url: "https://www.calm.com/" },
    { title: "Guided Meditation Sessions", url: "https://insighttimer.com/" },
  ],
};

export default Home;
