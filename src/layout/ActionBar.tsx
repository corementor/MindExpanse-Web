// // src/layout/ActionBar.tsx
// import React from "react";
// import { useAuth } from "@/contexts/AuthContext";

// const ActionBar = () => {
//   const { user } = useAuth();
//   const defaultThumbnail = "https://www.gravatar.com/avatar/?d=mp";

//   return (
//     <div className="rounded-full flex items-center gap-4 p-2">
//       <img
//         src={defaultThumbnail}
//         alt={user?.names || "user"}
//         referrerPolicy="no-referrer"
//         className="w-10 h-10 rounded-full border-2 border-primary"
//       />
//       <span className="flex flex-col">
//         <h1 className="font-semibold text-base">{user?.names}</h1>
//         <p className="text-muted-foreground text-sm">{user?.email}</p>
//       </span>
//     </div>
//   );
// };

// export default ActionBar;

// src/layout/ActionBar.tsx
import React from "react";
import { useAuth } from "@/contexts/AuthContext";

const ActionBar = () => {
  const { user } = useAuth();
  const defaultThumbnail = "https://www.gravatar.com/avatar/?d=mp";

  return (
    <div className="rounded-full flex items-center gap-2 md:gap-4 p-1 md:p-2">
      <img
        src={defaultThumbnail}
        alt={user?.names || "user"}
        referrerPolicy="no-referrer"
        className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-primary"
      />
      <span className="hidden md:flex md:flex-col">
        <h1 className="font-semibold text-base">{user?.names}</h1>
        <p className="text-muted-foreground text-sm">{user?.email}</p>
      </span>
      <span className="md:hidden text-sm font-medium">
        {user?.names?.split(" ")[0]}
      </span>
    </div>
  );
};

export default ActionBar;
