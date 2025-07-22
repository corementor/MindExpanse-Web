import React, { useEffect, useState } from "react";
import axios from "axios";
import { environment } from "../environment/environment";
const ActionBar = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    axios
      .get(`${environment.API}/auth/user-info`, {
        withCredentials: true,
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  });

  const username = localStorage.getItem("names");

  const email = localStorage.getItem("email");
  const defaultThumbnail = "https://www.gravatar.com/avatar/?d=mp";

  return (
    <div className=" rounded-full flex items-center gap-4 p-2">
      <img
        src={user?.picture || defaultThumbnail}
        alt={username || "user"}
        referrerPolicy="no-referrer"
        className="w-10 h-10 rounded-full border-2 border-whiteTheme-primaryColor"
      />
      <span className="flex flex-col">
        <h1 className="font-semibold text-base"> {user?.names || username}</h1>
        <p className="text-gray-500 text-sm">{user?.email || email}</p>
      </span>
    </div>
  );
};

export default ActionBar;
