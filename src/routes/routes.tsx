import MathGrid from "@/components/MathGrid/AdditionGrid";
import MathQuiz from "@/components/MathGrid/Addition";
import Subtraction from "@/components/MathGrid/Subtraction";
import SubtractionGrid from "@/components/MathGrid/SubtractionGrid";
import AppLayout from "@/layout/AppLayout";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import LoginPage from "@/pages/login/LoginPage";
import NotFound from "@/pages/NotFound";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Addition from "@/components/MathGrid/Addition";
import AdditionGrid from "@/components/MathGrid/AdditionGrid";

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
