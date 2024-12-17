import MathGrid from "@/components/MathGrid/MathGrid";
import MathQuiz from "@/components/MathGrid/MathQuiz";
import AppLayout from "@/layout/AppLayout";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import LoginPage from "@/pages/login/LoginPage";
import NotFound from "@/pages/NotFound";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
        path: "/mathgrid",
        element: <MathGrid />,
      },
      {
        path: "/mathquiz",
        element: <MathQuiz />,
      },
      // Add more routes here...
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
