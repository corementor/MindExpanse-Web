import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOff, Loader2, Brain } from "lucide-react";
import backgroundImage from "@/assets/imgs/arithmetic.jpg";
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

  return (
    <div
      className="w-full min-h-screen flex flex-col justify-center items-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
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
            {/* <div className="text-sm text-gray-600">
              <a
                href="/forgot-password"
                className="hover:text-primary transition-colors underline underline-offset-4"
              >
                Forgot your password?
              </a>
            </div> */}
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
