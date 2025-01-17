// src/App.tsx

import { AppRoutes } from "@/routes/routes";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <BrowserRouter>
      <div className="App w-full">
        <ToastContainer autoClose={1000} closeOnClick />
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
