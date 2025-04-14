import React from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "../components/ui/container";
import { Button } from "../components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container className="py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600">404</h1>
          <p className="mt-4 text-2xl font-semibold text-gray-900">Page Not Found</p>
          <p className="mt-2 text-gray-600">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>
        <Button
          onClick={() => navigate("/")}
          className="inline-flex items-center"
        >
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    </Container>
  );
};

export default NotFound;