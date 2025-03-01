import React from "react";

const ContactUs = () => {
  return (
    <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl mt-12">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Contact Us</h2>
      <p className="text-sm text-gray-600">
        Have any questions or feedback? Reach out to us!
      </p>
      <form className="mt-4">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600">Your Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter your name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600">Message</label>
          <textarea
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Type your message..."
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactUs; // ✅ Ensure default export exists
