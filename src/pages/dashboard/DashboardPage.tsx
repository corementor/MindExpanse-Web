import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardPage = () => {
  const [username, setUsername] = useState<string | null>(null);

  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("names");
    setUsername(
      storedUsername
        ? storedUsername.charAt(0).toUpperCase() + storedUsername.slice(1)
        : null
    );

    return () => {
      setUser(null);
    };
  }, []);

  const mathSections = [
    {
      title: "Addition Practice",
      description: "Start with basic addition problems",
      levels: ["Without Regrouping", "With Regrouping"],
      difficulty: "Beginner",
    },
    {
      title: "Subtraction Workshop",
      description: "Learn subtraction step by step",
      levels: ["Without Regrouping", "With Regrouping"],
      difficulty: "Beginner",
    },
    {
      title: "Multiplication Zone",
      description: "Master times tables and more",
      levels: ["With Regrouping", "Without Regrouping"],
      difficulty: "Intermediate",
    },
    {
      title: "Division Challenge",
      description: "Practice division concepts",
      levels: ["Long Division"],
      difficulty: "Advanced",
    },
  ];

  return (
    <div className="w-full h-full p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">
          Math Practice Sections
        </h1>
        <p className="text-gray-500 mt-2">
          {username
            ? `Welcome back, ${username || user.names}!`
            : "Welcome to Mind Expanse Math!"}{" "}
          Here are the available math practice sections to help you improve your
          skills.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {mathSections.map((section, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              {/* <CardDescription>
                Difficulty: {section.difficulty}
              </CardDescription> */}
              <CardTitle className="text-2xl">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-2">
                  {section.description}
                </p>
                <div className="text-sm font-medium">Available Lessons:</div>
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  {section.levels.map((level, i) => (
                    <li key={i}>{level}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
            {/* <CardFooter>
              <Button className="w-full">Start Practice</Button>
            </CardFooter> */}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
