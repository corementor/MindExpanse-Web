import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Divide, LogOut, Minus, Plus, X } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const AppLayout = () => {
  const logoutHandler = () => {
    localStorage.clear();
  };

  const getLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 hover:bg-muted rounded flex cursor-pointer items-center gap-2 ${
      isActive
        ? "text-primary cursor-pointer font-semibold hover:text-primary"
        : ""
    }`;

  return (
    <div className="w-[280px] border-r bg-background flex flex-col h-screen">
      <div className="flex h-20 items-center px-4 border-b font-bold">
        <span>Mind-Expanse</span>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <div className="px-3 py-2">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <NavLink to={"/dashboard"} className={getLinkClassName}>
                    Dashboard
                  </NavLink>
                </AccordionTrigger>
                <AccordionContent className="py-0">
                  <NavLink to="/additiongrid" className={getLinkClassName}>
                    <Plus className="w-4 h-4" /> <span>Addition</span>
                  </NavLink>
                </AccordionContent>
                <AccordionContent className="py-0">
                  <NavLink to="/subtractiongrid" className={getLinkClassName}>
                    <Minus className="w-4 h-4" /> <span>Substraction</span>
                  </NavLink>
                </AccordionContent>
                <AccordionContent className="py-0">
                  <NavLink
                    to="/multiplicationgrid"
                    className={getLinkClassName}
                  >
                    <X className="w-4 h-4" /> <span>Multiplication</span>
                  </NavLink>
                </AccordionContent>
                <AccordionContent className="py-0">
                  <NavLink to="/divisiongrid" className={getLinkClassName}>
                    <Divide className="w-4 h-4" /> <span>Division</span>
                  </NavLink>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-2 hover:bg-muted rounded cursor-pointer p-2">
            <LogOut className="w-4 h-4" />
            <NavLink to={"/login"} className="flex-1" onClick={logoutHandler}>
              <span>Logout</span>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AppLayout;
