// // src/layout/Navbar.tsx
// import ActionBar from "@/layout/ActionBar";

// const NavBar = () => {
//   return (
//     <nav className="bg-background h-20 shadow-sm px-5 py-4 flex items-center sticky top-0 z-10 justify-between border-b">
//       <p className="text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70"></p>
//       <div>
//         <ActionBar />
//       </div>
//     </nav>
//   );
// };

// export default NavBar;

// src/layout/Navbar.tsx
import ActionBar from "@/layout/ActionBar";

const NavBar = () => {
  return (
    <nav className="bg-background h-16 md:h-20 shadow-sm px-4 md:px-5 py-3 md:py-4 flex items-center sticky top-0 z-10 justify-between border-b">
      {/* Mobile Title */}
      <h1 className="text-xl font-bold text-primary md:hidden"> </h1>

      {/* Desktop Title */}
      <p className="text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70 hidden md:block"></p>

      <div>
        <ActionBar />
      </div>
    </nav>
  );
};

export default NavBar;
