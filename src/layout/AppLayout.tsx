import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Divide, Home, LogOut, Minus, Plus, X } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
const AppLayout = () => {
  const getLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded flex items-center gap-2 ${
      isActive ? "text-primary font-semibold hover:text-primary" : ""
    }`;

  return (
    <div className="grid min-h-screen md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="border-r">
        <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6 font-bold">
          <span>Exercice-app</span>
        </div>
        <div className="flex flex-col h-[calc(100vh-70px)] lg:span-1 text-sm font-medium">
          <nav className="flex flex-1 flex-col gap-2 px-4 py-4 lg:px-3">
            <NavLink to={"/dashboard"} className={getLinkClassName}>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Dashboard</AccordionTrigger>
                  <AccordionContent className="flex gap-2 items-center hover:bg-muted px-3 py-2 rounded">
                    <Plus className="w-4 h-4" /> <span>Addition</span>
                  </AccordionContent>
                  <AccordionContent className="flex gap-2 items-center hover:bg-muted px-3 py-2 rounded">
                    <Minus className="w-4 h-4" /> <span>Substraction</span>
                  </AccordionContent>
                  <AccordionContent className="flex gap-2 items-center hover:bg-muted px-3 py-2 rounded">
                    <X className="w-4 h-4" /> <span>Multiplication</span>
                  </AccordionContent>
                  <AccordionContent className="flex gap-2 items-center hover:bg-muted px-3 py-2 rounded">
                    <Divide className="w-4 h-4" /> <span>Division</span>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </NavLink>
          </nav>
          <div className="mx-4 py-2 lg:mx-3 lg:px-3 flex items-center gap-2 hover:bg-muted rounded cursor-pointer">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </div>
        </div>
      </div>
      <div className="mx-auto">
        <div className="h-[calc(100vh-70px)] px-8 py-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
