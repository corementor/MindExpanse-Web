import MathGrid from "@/components/MathGrid/MathGrid";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const DashboardPage = () => {
  return (
    <div className="w-full h-full">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <div className="grid lg:grid-cols-[400px_400px] gap-4 my-4 ">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Practice section one</CardDescription>
            <CardTitle className="text-2xl">
              Basic operations exercises
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              your progress is 65%, keep going!
            </div>
          </CardContent>
          <CardFooter>
            <Progress value={65} aria-label="25% increase" />
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Practice section one</CardDescription>
            <CardTitle className="text-2xl">
              Basic operations exercises
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              your progress is 25%, keep going!
            </div>
          </CardContent>
          <CardFooter>
            <Progress value={25} aria-label="25% increase" />
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Practice section one</CardDescription>
            <CardTitle className="text-2xl">
              Basic operations exercises
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              your progress is 25%, keep going!
            </div>
          </CardContent>
          <CardFooter>
            <Progress value={25} aria-label="25% increase" />
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Practice section one</CardDescription>
            <CardTitle className="text-2xl">
              Basic operations exercises
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              your progress is 25%, keep going!
            </div>
          </CardContent>
          <CardFooter>
            <Progress value={25} aria-label="25% increase" />
          </CardFooter>
        </Card>
        <MathGrid />
      </div>
    </div>
  );
};

export default DashboardPage;
