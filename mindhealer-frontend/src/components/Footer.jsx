import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Forum", path: "/forum" },
    { name: "Chat", path: "/chat" },
    { name: "Therapists", path: "/therapists" },
  ];

  return (
    <footer className="border-t bg-background py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="rounded-full bg-blue-600 p-1">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium">MindHealer</span>
          </div>
          <div className="flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="mt-4 md:mt-0 text-xs text-gray-600">
            &copy; {new Date().getFullYear()} MindHealer. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
