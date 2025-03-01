import React from "react";

const testimonials = [
  {
    name: "John Doe",
    feedback:
      "MindHealer has been a game changer for my mental well-being. The community is so supportive!",
    avatar: "https://via.placeholder.com/50",
  },
  {
    name: "Jane Smith",
    feedback:
      "I found a wonderful therapist through this platform. Highly recommended!",
    avatar: "https://via.placeholder.com/50",
  },
  {
    name: "Emily Johnson",
    feedback:
      "The stress management resources have really helped me cope with anxiety. Thank you!",
    avatar: "https://via.placeholder.com/50",
  },
];

const Testimonials = () => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-10 mx-auto max-w-4xl">
      <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">
        💬 Testimonials
      </h2>
      <div className="space-y-4">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="flex items-center space-x-4 border-b pb-4">
            <img
              src={testimonial.avatar}
              alt="User Avatar"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="text-gray-800 text-lg font-medium">
                {testimonial.name}
              </p>
              <p className="text-gray-600 text-sm">{testimonial.feedback}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
