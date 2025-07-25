import NavBar from "@/layout/Navbar";

import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

export const DashboardLayout = () => {
  return (
    <div className="flex w-full h-screen">
      <SideBar />
      <div className="flex flex-col flex-1">
        <NavBar />
        <main className="flex-1 overflow-auto">
          <div className="p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
