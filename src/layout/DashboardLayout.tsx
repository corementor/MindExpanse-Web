import NavBar from "@/layout/Navbar";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

export const DashboardLayout = () => {
  return (
    <div className="flex w-full h-screen min-h-screen">
      <SideBar />
      <div className="flex flex-col w-full">
        <NavBar />
        <div className="flex-grow overflow-auto p-2 md:p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
