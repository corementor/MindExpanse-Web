// src/App.tsx
import { AppRoutes } from "@/routes/routes";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/contexts/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App w-full">
          <ToastContainer autoClose={1000} closeOnClick />
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
