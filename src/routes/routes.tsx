import Subtraction from "@/components/MathGrid/subtraction/Subtraction";
import SubtractionGrid from "@/components/MathGrid/subtraction/SubtractionGrid";
import AppLayout from "@/layout/AppLayout";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import LoginPage from "@/pages/login/LoginPage";
import NotFound from "@/pages/NotFound";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Addition from "@/components/MathGrid/addition/Addition";
import AdditionGrid from "@/components/MathGrid/addition/AdditionGrid";
import MultiplicationGrid from "@/components/MathGrid/multiplication/MultiplicationGrid";
import Multiplication from "@/components/MathGrid/multiplication/Multiplication";
import Division from "@/components/MathGrid/division/Division";
import DivisionGrid from "@/components/MathGrid/division/DivisionGrid";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/additiongrid",
        element: <AdditionGrid />,
      },
      {
        path: "/addition",
        element: <Addition />,
      },
      {
        path: "/subtractiongrid",
        element: <SubtractionGrid />,
      },
      {
        path: "/subtraction",
        element: <Subtraction />,
      },
      {
        path: "/multiplicationgrid",
        element: <MultiplicationGrid />,
      },
      {
        path: "/multiply",
        element: <Multiplication />,
      },
      {
        path: "/divisiongrid",
        element: <DivisionGrid />,
      },
      {
        path: "/divide",
        element: <Division />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
