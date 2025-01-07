import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Progress } from "../../ui/progress";
import { useNavigate } from "react-router-dom";
import { images } from "@/constants/images";
const MultiplicationGrid: React.FC = () => {
  const navigate = useNavigate();

  const handleCardClick = (type: string) => {
    navigate(`/multiply?type=${type}`);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-4 my-4">
      <Card className="overflow-hidden shadow-md">
        <div className="relative h-40">
          <img
            src={
              // "https://images.pexels.com/photos/16613920/pexels-photo-16613920/free-photo-of-first-grade-student.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              images.doublenum
            }
            alt="Single Digit Multiplication"
            className="object-cover w-full h-full scale-x-125"
          />
        </div>
        <CardHeader className="pb-2">
          <CardDescription>Multiplication by double Digits</CardDescription>
          <CardTitle className="text-2xl">
            Learn Basic 2-Digit Multiplication Operations
          </CardTitle>
        </CardHeader>
        <CardContent
          className="cursor-pointer hover:bg-primary-100 transition-colors"
          onClick={() => handleCardClick("twoDigit")}
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

      <Card className="overflow-hidden shadow-md">
        <div className="relative h-40">
          <img
            src={
              //   "https://media.istockphoto.com/id/1297051350/photo/little-boy-learning-numbers-and-mathematics-basics-homeschooling.jpg?s=1024x1024&w=is&k=20&c=_x5mu62ol7D_jKou-BrANueA1ESCFw1NWWXtttGA0HE="

              //   "https://images.pexels.com/photos/5412110/pexels-photo-5412110.jpeg"

              //   images.single
              images.multiply
            }
            alt="Single Digit Multiplication"
            className="object-cover w-full h-full mb-5"
          />
        </div>
        <CardHeader className="pb-2">
          <CardDescription>Multiplication by single Digits</CardDescription>
          <CardTitle className="text-2xl">
            Learn Basic 1-Digit Multiplication Operations
          </CardTitle>
        </CardHeader>
        <CardContent
          className="cursor-pointer hover:bg-primary-100 transition-colors"
          onClick={() => handleCardClick("singleDigit")}
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

export default MultiplicationGrid;
