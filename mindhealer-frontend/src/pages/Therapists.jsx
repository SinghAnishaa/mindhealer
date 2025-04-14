import React, { useState } from "react";
import { Container } from "../components/ui/container";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Calendar, Clock, Star, Award, Heart } from "lucide-react";
import { Modal, Box, TextField } from "@mui/material";

const therapistsData = [
  { 
    id: 1, 
    name: "Dr. Emily Smith", 
    specialization: "Anxiety & Stress Management", 
    experience: "10 years",
    rating: 4.9,
    availability: "Online",
    certifications: ["Licensed Clinical Psychologist", "CBT Certified"],
    image: "https://randomuser.me/api/portraits/women/44.jpg" 
  },
  { 
    id: 2, 
    name: "Dr. John Doe", 
    specialization: "Depression & Mood Disorders", 
    experience: "8 years",
    rating: 4.8,
    availability: "In-Person & Online",
    certifications: ["Licensed Therapist", "EMDR Certified"],
    image: "https://randomuser.me/api/portraits/men/45.jpg" 
  },
  { 
    id: 3, 
    name: "Dr. Sarah Brown", 
    specialization: "Relationship Counseling", 
    experience: "12 years",
    rating: 4.9,
    availability: "Online",
    certifications: ["Marriage & Family Therapist", "Gottman Certified"],
    image: "https://randomuser.me/api/portraits/women/46.jpg" 
  },
];

const Therapists = () => {
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    date: "",
    time: "",
  });

  const handleOpen = (therapist) => {
    setSelectedTherapist(therapist);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTherapist(null);
    setFormData({ fullName: "", email: "", date: "", time: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Appointment booked with ${selectedTherapist.name} on ${formData.date} at ${formData.time}`);
    handleClose();
  };

  return (
    <Container className="py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Mental Health Professionals</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with licensed therapists and counselors specialized in various areas of mental health
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {therapistsData.map((therapist) => (
            <Card key={therapist.id} className="animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={therapist.image}
                    alt={therapist.name}
                    className="w-24 h-24 rounded-full object-cover border-2 border-blue-100"
                  />
                  <div>
                    <h3 className="font-semibold text-xl text-gray-900">{therapist.name}</h3>
                    <p className="text-blue-600 font-medium text-sm mb-2">{therapist.specialization}</p>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <Award className="h-4 w-4 mr-1" />
                      <span>{therapist.experience} experience</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 mr-1 text-yellow-400" />
                      <span>{therapist.rating} rating</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-2">
                    <Heart className="h-4 w-4 inline mr-1 text-blue-600" />
                    <span>Specializes in:</span>
                    <ul className="list-disc list-inside ml-5 mt-1">
                      {therapist.certifications.map((cert, index) => (
                        <li key={index}>{cert}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    <Clock className="h-4 w-4 inline mr-1" />
                    <span>Available: {therapist.availability}</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleOpen(therapist)}
                  className="w-full mt-2"
                >
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Booking Modal */}
        <Modal open={open} onClose={handleClose}>
          <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="mb-6 text-center">
              <h3 className="text-xl font-bold mb-2">Book an Appointment</h3>
              {selectedTherapist && (
                <p className="text-gray-600">with {selectedTherapist.name}</p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
              />
              <div className="flex space-x-4">
                <Button
                  type="submit"
                  className="flex-1"
                >
                  Confirm Booking
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Box>
        </Modal>
      </div>
    </Container>
  );
};

export default Therapists;
