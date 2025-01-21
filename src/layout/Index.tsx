import NavBar from "@/layout/Navbar";

import { Outlet } from "react-router-dom";
import AppLayout from "./SideBar";

export const DashboardLayout = () => {
  return (
    <div className="flex w-full h-screen min-h-screen">
      <AppLayout />
      <div className="flex flex-col w-full">
        <NavBar />
        <div className="flex-grow overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
