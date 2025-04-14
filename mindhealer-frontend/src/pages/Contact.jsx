import React from "react";
import { Container } from "../components/ui/container";
import ContactUs from "../components/ContactUs";
import { MapPin, Phone, Mail, MessageSquare } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    { 
      icon: MapPin, 
      title: "Visit Us",
      details: ["123 Wellness Street", "San Francisco, CA 94105"]
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+1 (555) 123-4567", "Mon-Fri: 9am - 6pm PST"]
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["support@mindhealer.com", "For general inquiries"]
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      details: ["Available 24/7", "Average response time: 5 minutes"]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Contact Info Section */}
      <section className="bg-gray-50 py-12">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
            <p className="text-xl text-gray-600">
              We're here to support you on your mental health journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {contactInfo.map((item, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-blue-50 rounded-full mb-4">
                    <item.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  {item.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600">{detail}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Map Section - Placeholder for future Google Maps integration */}
      <section className="py-12 bg-white">
        <Container>
          <div className="bg-gray-200 h-[400px] rounded-lg flex items-center justify-center">
            <p className="text-gray-600">Google Maps will be integrated here</p>
          </div>
        </Container>
      </section>

      {/* Contact Form Section */}
      <ContactUs />
    </div>
  );
};

export default Contact;