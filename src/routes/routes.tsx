import MathGrid from "@/components/MathGrid/MathGrid";
import AppLayout from "@/layout/AppLayout";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import LoginPage from "@/pages/login/LoginPage";
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
        path: "addition",
        element: <MathGrid />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
