import React from "react";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white text-center p-4 mt-12">
      <div className="container mx-auto">
        <p className="text-sm">&copy; {new Date().getFullYear()} MindHealer. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
          <a href="/terms" className="hover:underline">Terms of Service</a>
          <a href="/contact" className="hover:underline">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
