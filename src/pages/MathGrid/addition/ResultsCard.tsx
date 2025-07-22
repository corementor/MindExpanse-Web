import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileCheck, Plus, RefreshCcw } from "lucide-react";

const ResultsCard: React.FC<{
  score: number;
  total: number;
  percentage: number;
  onTryAgain: () => void;
  onNewQuestions: () => void;
}> = ({ score, total, percentage, onTryAgain, onNewQuestions }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">
          {percentage >= 80 ? "🎉 Great Job!" : "Keep Practicing!"}
        </CardTitle>
        <CardDescription className="text-center">
          {percentage >= 80
            ? "You're mastering addition!"
            : "You're getting better with each practice."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {score}/{total}
            </div>
            <div className="text-lg text-gray-600">
              {Math.round(percentage)}% Correct
            </div>
          </div>

          <Progress value={percentage} className="h-4 w-full" />

          <div className="grid grid-cols-2 gap-4 w-full">
            <Button
              onClick={onTryAgain}
              variant="outline"
              className="py-4 text-lg"
            >
              <RefreshCcw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={onNewQuestions}
              className="py-4 text-lg bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Questions
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <FileCheck className="w-5 h-5 text-gray-400 mr-2" />
        <span className="text-sm text-gray-500">
          Practice makes perfect! Keep going!
        </span>
      </CardFooter>
    </Card>
  );
};
