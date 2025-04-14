import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Container } from "./ui/container";
import { Button } from "./ui/button";
import { MessageCircle } from "lucide-react";

const ContactUs = () => {
  return (
    <section className="py-16">
      <Container>
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <MessageCircle className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription>Have any questions or feedback? Reach out to us!</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="input w-full"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  className="input w-full min-h-[100px]"
                  placeholder="Type your message..."
                ></textarea>
              </div>
              <Button className="w-full">Send Message</Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
};

export default ContactUs;
