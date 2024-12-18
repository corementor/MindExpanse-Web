import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";
import { useNavigate } from "react-router-dom";
import { images } from "@/constants/images";
const SubtractionGrid: React.FC = () => {
  const navigate = useNavigate();

  const handleCardClick = (type: string) => {
    navigate(`
        ${type}
      `);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-4 my-4">
      {/* Card for Single-Digit Addition */}
      <Card className="overflow-hidden shadow-md">
        <div className="relative h-40">
          <img
            src={images.doublenum} // Replace with a relevant image URL
            alt="Double Digits Subtraction"
            className="object-cover w-full h-full"
          />
        </div>
        <CardHeader className="pb-2">
          <CardDescription>Double Digits Subtraction</CardDescription>
          <CardTitle className="text-2xl">
            Learn Basic 2-Digit Subtraction Operations
          </CardTitle>
        </CardHeader>
        <CardContent
          className="cursor-pointer hover:bg-primary-100 transition-colors"
          onClick={() => navigate("/subtraction")}
        >
          <div className="text-xs text-muted-foreground">
            Your progress is 45%, keep going!
          </div>
          <div className="mt-2 text-primary font-medium">
            Click here to start the Quiz
          </div>
        </CardContent>
        <CardFooter>
          <Progress value={45} aria-label="45% increase" />
        </CardFooter>
      </Card>

      {/* Card for Two-Digit Addition */}
      <Card className="overflow-hidden shadow-md">
        <div className="relative h-40">
          <img
            src={images.single} // Replace with a relevant image URL
            alt="Two Digit Addition"
            className="object-cover w-full h-full"
          />
        </div>
        <CardHeader className="pb-2">
          <CardDescription>Subtraction by Multiple digits</CardDescription>
          <CardTitle className="text-2xl">
            Learn Basic subtraction by Multiple Digits Operations
          </CardTitle>
        </CardHeader>
        <CardContent
          className="cursor-pointer hover:bg-primary-100 transition-colors"
          onClick={() => handleCardClick("/subtraction")}
        >
          <div className="text-xs text-muted-foreground">
            Your progress is 65%, keep going!
          </div>
          <div className="mt-2 text-primary font-medium">
            Click here to start the 2-digit addition course
          </div>
        </CardContent>
        <CardFooter>
          <Progress value={65} aria-label="65% increase" />
        </CardFooter>
      </Card>
    </div>
  );
};

export default SubtractionGrid;
