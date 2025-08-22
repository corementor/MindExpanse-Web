// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOff, Loader2, Brain } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/AuthService";

const LoginPage = () => {
   const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.username || formData.username.length < 2) {
      return "Username must be at least 2 characters long";
    }
    if (!formData.password || formData.password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      // Error will be shown by the auth service toast

      return;
    }

    try {
      await login(formData);
      navigate("/dashboard");
    } catch (error) {
      // Error handling is done in the auth service
    }
  };

  const handleGoogleLogin = () => {
    console.log("Redirecting to Google login...");
  };

  //   return (
  //     <div className="w-full min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 to-purple-50">
  //       <div className="mb-5 flex flex-col items-center">
  //         <div className="flex items-center gap-3 mb-4">
  //           <Brain className="h-12 w-12 text-primary animate-pulse" />
  //           <h1 className="text-4xl font-bold text-primary">Mind Expanse</h1>
  //         </div>
  //         <p className="text-xl text-muted-foreground mt-2">
  //           Welcome back to your learning journey!
  //         </p>
  //       </div>

  //       <Card className="w-full max-w-md mx-4 shadow-lg border-2 border-primary/20">
  //         <CardHeader className="space-y-2">
  //           <CardTitle className="text-2xl text-center">Sign In</CardTitle>
  //         </CardHeader>

  //         <CardContent className="space-y-6">
  //           {/* <Button
  //             variant="outline"
  //             className="w-full hover:bg-primary/5"
  //             disabled={isLoading}
  //             onClick={handleGoogleLogin}
  //           >
  //             <img
  //               src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNICAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4="
  //               alt="Google"
  //               className="w-5 h-5 mr-2"
  //             />
  //             Continue with Google Account
  //           </Button> */}

  //           <div className="relative">
  //             <div className="absolute inset-0 flex items-center">
  //               <div className="w-full border-t" />
  //             </div>
  //             <div className="relative flex justify-center text-xs uppercase">
  //               <span className="bg-card px-2 text-muted-foreground">
  //                 Use your credentials
  //               </span>
  //             </div>
  //           </div>

  //           <form onSubmit={handleSubmit} className="space-y-4">
  //             <div className="space-y-2">
  //               <label className="text-sm font-medium">Username</label>
  //               <Input
  //                 name="username"
  //                 value={formData.username}
  //                 onChange={handleInputChange}
  //                 placeholder="Enter your username"
  //                 required
  //                 disabled={isLoading}
  //               />
  //             </div>

  //             <div className="space-y-2">
  //               <label className="text-sm font-medium">Password</label>
  //               <div className="relative">
  //                 <Input
  //                   type={showPassword ? "text" : "password"}
  //                   name="password"
  //                   value={formData.password}
  //                   onChange={handleInputChange}
  //                   className="pr-10"
  //                   placeholder="Enter your password"
  //                   required
  //                   disabled={isLoading}
  //                 />
  //                 <button
  //                   type="button"
  //                   className="absolute right-3 top-1/2 -translate-y-1/2"
  //                   onClick={() => setShowPassword(!showPassword)}
  //                   disabled={isLoading}
  //                 >
  //                   {showPassword ? (
  //                     <EyeOff className="h-4 w-4 text-muted-foreground" />
  //                   ) : (
  //                     <EyeIcon className="h-4 w-4 text-muted-foreground" />
  //                   )}
  //                 </button>
  //               </div>
  //             </div>

  //             <Button type="submit" className="w-full" disabled={isLoading}>
  //               {isLoading ? (
  //                 <>
  //                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  //                   Signing in...
  //                 </>
  //               ) : (
  //                 "Sign In"
  //               )}
  //             </Button>
  //           </form>
  //         </CardContent>

  //         <CardFooter className="flex flex-col space-y-4 text-center">
  //           <div className="text-sm text-muted-foreground">
  //             <a
  //               href="/forgot-password"
  //               className="hover:text-primary underline underline-offset-4"
  //             >
  //               Forgot your password?
  //             </a>
  //           </div>
  //           <div className="text-sm">
  //             New to Mind Expanse?{" "}
  //             <a
  //               href="/signup"
  //               className="text-primary hover:underline font-medium"
  //             >
  //               Create an account
  //             </a>
  //           </div>
  //         </CardFooter>
  //       </Card>
  //     </div>
  //   );
  // };

  // export default LoginPage;

  return (
    <div
      className="w-full min-h-screen flex flex-col justify-center items-center relative overflow-hidden"
      style={{
        backgroundImage: "url('src/assets/imgs/arithmetic.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay with backdrop filter */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Glass morphism container */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-full">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Mind Expanse</h1>
          </div>
          <p className="text-xl text-white/80">
            Welcome back to your learning journey!
          </p>
        </div>

        <Card className="w-full backdrop-blur-xl bg-white/90 shadow-2xl border-0">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-center font-semibold">
              Sign In
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  className="bg-white/50 backdrop-blur-sm border-gray-200 focus:bg-white transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pr-10 bg-white/50 backdrop-blur-sm border-gray-200 focus:bg-white transition-colors"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 text-center">
            <div className="text-sm text-gray-600">
              <a
                href="/forgot-password"
                className="hover:text-primary transition-colors underline underline-offset-4"
              >
                Forgot your password?
              </a>
            </div>
            <div className="text-sm text-gray-600">
              New to Mind Expanse?{" "}
              <a
                href="/signup"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Create an account
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
