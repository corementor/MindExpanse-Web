import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Divide, LogOut, Minus, Plus, X } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
const AppLayout = () => {
  const getLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 hover:bg-muted rounded flex cursor-pointer items-center gap-2 ${
      isActive
        ? "text-primary cursor-pointer font-semibold hover:text-primary"
        : ""
    }`;

  return (
    <div className="grid min-h-screen md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="border-r">
        <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6 font-bold">
          <span>Mind-Expanse</span>
        </div>
        <div className="flex flex-col h-[calc(100vh-70px)] lg:span-1 text-sm font-medium">
          <nav className="flex flex-1 flex-col gap-2 px-4 py-4 lg:px-3">
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
          <div className="mx-4 py-2 lg:mx-3 lg:px-3 flex items-center gap-2 hover:bg-muted rounded cursor-pointer relative">
            <LogOut className="w-4 h-4" />
            <NavLink to={"/login"} className={getLinkClassName}>
              <span>Logout</span>
            </NavLink>
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
