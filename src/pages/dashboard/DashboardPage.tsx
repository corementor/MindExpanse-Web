import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { environment } from "@/environment/environment";
import { Progress } from "@/components/ui/progress";

const DashboardPage = () => {
  const [username, setUsername] = useState<string | null>(null);

  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    axios
      .get(`${environment.API}/auth/user-info`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });

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

  const progressSections = [
    {
      title: "Basic operations exercises",
      description: "Practice section one",
      progress: 65,
    },
    {
      title: "Advanced operations",
      description: "Practice section two",
      progress: 25,
    },
    {
      title: "Problem solving",
      description: "Practice section three",
      progress: 40,
    },
    {
      title: "Word problems",
      description: "Practice section four",
      progress: 15,
    },
  ];

  return (
    <div className="w-full h-full p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <p className="text-gray-500 mt-2">
          {username
            ? `Welcome back, ${username || user.names}!`
            : "Welcome to Mind Expanse!"}{" "}
          Here's what you've been working on.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {progressSections.map((section, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardDescription>{section.description}</CardDescription>
              <CardTitle className="text-2xl">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Your progress is {section.progress}%, keep going!
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={section.progress} className="h-2" />
            </CardFooter>
          </Card>
        ))}
        {/* {loading && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default DashboardPage;
