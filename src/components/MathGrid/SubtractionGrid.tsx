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
    navigate(`/subtraction?type=${type}`);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-4 my-4">
      <Card className="overflow-hidden shadow-md">
        <div className="relative h-40">
          <img
            src="https://media.istockphoto.com/id/1226584282/photo/hand-flipping-black-of-plus-to-minus-sign-which-print-screen-on-wooden-cube.jpg?s=1024x1024&w=is&k=20&c=VyDrKV1s3Ll4YhpNdTPbI8l7wg3RTZwwgUJGErF0Zx8="
            alt="Single Digit Subtraction"
            className="object-cover w-full h-full  "
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
            src={images.sub}
            alt="Double Digits Subtraction"
            className="object-fill w-full h-full scale-y-125"
          />
        </div>
        <CardHeader className="pb-2">
          <CardDescription>Subtraction by Single digits</CardDescription>
          <CardTitle className="text-2xl">
            Learn Basic subtraction 1 Digit Operations
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

export default SubtractionGrid;
