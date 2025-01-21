import NavBar from "@/layout/Navbar";

import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

export const DashboardLayout = () => {
  return (
    <div className="flex w-full h-screen min-h-screen">
      <SideBar />
      <div className="flex flex-col w-full">
        <NavBar />
        <div className="mx-auto">
          <div className="h-[calc(100vh-70px)] px-8 py-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
