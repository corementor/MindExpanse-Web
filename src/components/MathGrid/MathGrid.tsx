import { Check} from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const MathGrid = () => {
  const problems = [
    { question: "4 + 1 =", id: 1 },
    { question: "5 + 3 =", id: 2 },
    { question: "9 + 1 =", id: 3 },
    { question: "2 + 2 =", id: 4 },
    { question: "6 + 4 =", id: 5 },
    { question: "6 - 2 =", id: 6 },
    { question: "7 - 3 =", id: 7 },
    { question: "10 - 5 =", id: 8 },
    { question: "9 - 3 =", id: 9 },
    { question: "4 - 2 =", id: 10 },
  ];

  return (
    <div className="min-w-[500px] border-[1px] border-gray-200 rounded-md p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Instructions: Solve the operations
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {problems.map((problem) => (
          <div key={problem.id} className="flex items-center gap-2">
            <span className="w-[80px] text-xl font-semibold">
              {problem.question}
            </span>
            <Input className="w-10 text-center" placeholder="?" />
          </div>
        ))}
      </div>
      <Button className="w-full mt-4 flex items-center justify-center gap-2">
        <Check className="w-4 h-4" />
        <span>Submit</span>
      </Button>
    </div>
  );
};

export default MathGrid;
