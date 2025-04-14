import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Container } from "./ui/container";
import { Activity, Calendar, MessageSquare, Clock } from "lucide-react";

const statCards = [
  {
    title: "Mood Today",
    value: "😊",
    icon: Activity,
    description: "You're feeling good!",
    color: "blue",
  },
  {
    title: "Journal Streak",
    value: "7 days",
    icon: Calendar,
    description: "Keep it up!",
    color: "green",
  },
  {
    title: "Chat Sessions",
    value: "3",
    icon: MessageSquare,
    description: "This week",
    color: "purple",
  },
  {
    title: "Next Therapy",
    value: "Tomorrow",
    icon: Clock,
    description: "2:00 PM",
    color: "orange",
  },
];

const DashboardSnapshot = ({ data }) => {
  return (
    <section className="py-6">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <Card
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 bg-${card.color}-100 rounded-full`}>
                      <IconComponent
                        className={`h-6 w-6 text-${card.color}-600`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {card.title}
                      </p>
                      <div className="flex items-baseline">
                        <p className="text-2xl font-semibold text-gray-900">
                          {data?.[card.title.toLowerCase().replace(/\s+/g, "_")] ||
                            card.value}
                        </p>
                        {card.description && (
                          <p className="ml-2 text-sm text-gray-500">
                            {card.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default DashboardSnapshot;

