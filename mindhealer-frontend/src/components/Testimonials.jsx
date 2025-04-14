import React from "react";
import { Card, CardContent } from "./ui/card";
import { Container } from "./ui/container";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "John Doe",
    feedback:
      "MindHealer has been a game changer for my mental well-being. The community is so supportive!",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
  },
  {
    name: "Jane Smith",
    feedback:
      "I found a wonderful therapist through this platform. Highly recommended!",
    avatar: "https://randomuser.me/api/portraits/women/42.jpg",
  },
  {
    name: "Emily Johnson",
    feedback:
      "The stress management resources have really helped me cope with anxiety. Thank you!",
    avatar: "https://randomuser.me/api/portraits/women/43.jpg",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-50">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Read how MindHealer has helped people on their mental health journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="relative animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="pt-12 pb-8">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="rounded-full bg-blue-600 p-3">
                    <Quote className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="text-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-blue-100"
                  />
                  <h3 className="font-semibold text-lg mb-2">{testimonial.name}</h3>
                  <p className="text-gray-600 italic">{testimonial.feedback}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;
