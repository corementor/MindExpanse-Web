import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Divide,
  LogOut,
  Minus,
  Plus,
  X,
  LayoutDashboard,
  Menu,
  XIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const SideBar = () => {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const getLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 hover:bg-muted rounded flex cursor-pointer items-center gap-2 ${
      isActive
        ? "text-primary cursor-pointer font-semibold hover:text-primary bg-muted"
        : "text-muted-foreground"
    }`;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Desktop Logo */}
      <div className="flex h-20 items-center px-4 border-b font-bold hidden md:flex">
        <span>Infinity-Mind</span>
      </div>

      {/* Mobile Logo (inside sheet) */}
      <div className="flex h-20 items-center px-4 border-b font-bold md:hidden">
        <span>Infinity-Mind</span>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto md:hidden"
          onClick={() => setIsOpen(false)}
        >
          <XIcon className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation Content - This will take available space */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-1">
          {/* Dashboard Link */}
          <NavLink
            to="/dashboard"
            className={getLinkClassName}
            onClick={() => setIsOpen(false)}
          >
            <LayoutDashboard className="w-4 h-4 " />
            <span className="font-bold">Dashboard</span>
          </NavLink>

          {/* Arithmetic Operations Accordion */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="arithmetic" className="border-none">
              <AccordionTrigger className="px-2 py-2 hover:bg-muted rounded flex cursor-pointer items-center gap-2">
                <span>Arithmetic Operations</span>
              </AccordionTrigger>
              <AccordionContent className="pl-6 space-y-1 mt-1">
                <NavLink
                  to="/additiongrid"
                  className={getLinkClassName}
                  onClick={() => setIsOpen(false)}
                >
                  <Plus className="w-4 h-4" />
                  <span>Addition</span>
                </NavLink>
                <NavLink
                  to="/subtractiongrid"
                  className={getLinkClassName}
                  onClick={() => setIsOpen(false)}
                >
                  <Minus className="w-4 h-4" />
                  <span>Subtraction</span>
                </NavLink>
                <NavLink
                  to="/multiplicationgrid"
                  className={getLinkClassName}
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                  <span>Multiplication</span>
                </NavLink>
                <NavLink
                  to="/divisiongrid"
                  className={getLinkClassName}
                  onClick={() => setIsOpen(false)}
                >
                  <Divide className="w-4 h-4" />
                  <span>Division</span>
                </NavLink>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Logout Button - This will be pushed to the bottom */}
      <div className="mt-auto p-4 border-t">
        <button
          onClick={() => {
            logout();
            setIsOpen(false);
          }}
          className="flex items-center gap-2 w-full p-2 hover:bg-muted rounded cursor-pointer text-muted-foreground hover:text-foreground"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar (Sheet) */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="ml-4 mt-4 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col w-[280px] border-r bg-background h-screen">
        {sidebarContent}
      </div>
    </>
  );
};

export default SideBar;
