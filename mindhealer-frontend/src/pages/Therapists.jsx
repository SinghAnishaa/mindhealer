import React, { useState } from "react";
import { Button, Modal, Box, Typography, TextField, MenuItem } from "@mui/material";

const therapistsData = [
  { 
    id: 1, 
    name: "Dr. Emily Smith", 
    specialization: "Anxiety & Stress", 
    experience: "10 years", 
    availability: "Online", 
    image: "https://randomuser.me/api/portraits/women/44.jpg" 
  },
  { 
    id: 2, 
    name: "Dr. John Doe", 
    specialization: "Depression Therapy", 
    experience: "8 years", 
    availability: "Offline", 
    image: "https://randomuser.me/api/portraits/men/45.jpg" 
  },
  { 
    id: 3, 
    name: "Dr. Sarah Brown", 
    specialization: "Relationship Counseling", 
    experience: "12 years", 
    availability: "Online", 
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
    setFormData({ fullName: "", email: "", date: "", time: "" }); // Reset form
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
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-blue-400 to-blue-600 text-white p-10">
      
      {/* Fixed Title Visibility */}
      <h2 className="text-3xl font-bold text-white mb-6 mt-6 text-center">
        🩺 <span className="bg-white text-blue-600 px-3 py-1 rounded-md">Find a Therapist</span>
      </h2>

      {/* Therapist Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {therapistsData.map((therapist) => (
          <div key={therapist.id} className="bg-white text-gray-800 rounded-lg shadow-md p-5 text-center w-80">
            <img src={therapist.image} alt={therapist.name} className="w-24 h-24 mx-auto rounded-full mb-4" />
            <h3 className="text-lg font-bold">{therapist.name}</h3>
            <p className="text-sm">{therapist.specialization}</p>
            <p className="text-xs text-gray-500">Experience: {therapist.experience}</p>
            <p className={therapist.availability === "Online" ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
              {therapist.availability}
            </p>
            <Button 
              variant="contained" 
              color="primary" 
              className="mt-3"
              onClick={() => handleOpen(therapist)}
            >
              Book Appointment
            </Button>
          </div>
        ))}
      </div>

      {/* Modal for Booking */}
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
        <Box className="bg-white p-6 rounded-lg shadow-lg w-96 mx-auto mt-20">
          {selectedTherapist && (
            <>
              <Typography id="modal-title" variant="h6" className="text-blue-600 font-bold">
                Book Appointment with {selectedTherapist.name}
              </Typography>
              <form onSubmit={handleSubmit} className="mt-4">
                <TextField 
                  fullWidth 
                  label="Full Name" 
                  name="fullName"
                  value={formData.fullName} 
                  onChange={handleChange} 
                  required
                  margin="dense"
                />
                <TextField 
                  fullWidth 
                  label="Email" 
                  name="email"
                  value={formData.email} 
                  onChange={handleChange} 
                  required
                  margin="dense"
                />
                <TextField
                  fullWidth
                  label="Date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  margin="dense"
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
                  margin="dense"
                  InputLabelProps={{ shrink: true }}
                />

                <Button type="submit" variant="contained" color="primary" className="mt-4 w-full">
                  Confirm Appointment
                </Button>
              </form>
              <Button onClick={handleClose} variant="outlined" color="secondary" className="mt-2 w-full">
                Cancel
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default Therapists;
