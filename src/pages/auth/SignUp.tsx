import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import backgroundImage from "@/assets/imgs/arithmetic.jpg";
import {
  EyeIcon,
  EyeOff,
  Loader2,
  Mail,
  User,
  Check,
  X,
  Brain,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import RegService from "./RegService";
const signUpSchema = z
  .object({
    firstName: z.string().min(2, "First Name must be at least 2 characters"),
    lastName: z.string().min(2, "Last Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      )
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const SignupPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [showValidations, setShowValidations] = useState(false);

  const navigate = useNavigate();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any
  ) => {
    field.onChange(e);
    setPassword(e.target.value);
    if (!showValidations) {
      setShowValidations(true);
    }
  };

  const passwordRequirements = [
    { label: "At least 8 characters", regex: /.{8,}/ },
    { label: "One uppercase letter", regex: /[A-Z]/ },
    { label: "One lowercase letter", regex: /[a-z]/ },
    { label: "One number", regex: /[0-9]/ },
    { label: "One special character", regex: /[^A-Za-z0-9]/ },
  ];

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    setIsSubmitting(true);

    if (values.password !== values.confirmPassword) {
      form.setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const requestData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      };

      const response = await RegService.RegisterUser(requestData);

      if (response) {
        toast.success(
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-green-800">
              Account created successfully! 🎉
            </span>
            <span className="text-sm">
              Welcome, {values.firstName + " " + values.lastName}!
            </span>
            <span className="text-xs text-gray-600 mt-1">
              Please check your email for your username.
            </span>
          </div>,
          {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: "custom-toast",
            style: {
              background: "#f0fdf4",
              border: "1px solid #86efac",
              borderRadius: "8px",
              padding: "16px",
            },
          }
        );

        // Add a slight delay before navigation
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        form.setError("email", {
          type: "manual",
          message: "This email is already registered. Please use another.",
        });
      } else {
        toast.error(
          error?.response?.data?.message || "An unexpected error occurred.",
          {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            style: {
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
            },
          }
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

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
      <div className="relative z-10 w-full max-w-4xl px-4">
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-full">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Mind Expanse</h1>
          </div>
          <p className="text-xl text-white/80">Start your math adventure!</p>
        </div>

        <Card className="w-full backdrop-blur-xl bg-white/90 shadow-2xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl text-center font-semibold">
              Create Account
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-4">
                  {/* First Column */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="First Name"
                                className="pl-10 bg-white/50 backdrop-blur-sm border-gray-200 focus:bg-white transition-colors"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="names@example.com"
                                className="pl-10 bg-white/50 backdrop-blur-sm border-gray-200 focus:bg-white transition-colors"
                                type="email"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                className="pr-10 bg-white/50 backdrop-blur-sm border-gray-200 focus:bg-white transition-colors"
                                placeholder="Create a password"
                                {...field}
                                onChange={(e) => handlePasswordChange(e, field)}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <EyeIcon className="h-4 w-4 text-muted-foreground" />
                                )}
                              </button>
                              {/* ... rest of the password input ... */}
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Second Column */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Last name"
                                className="pl-10 bg-white/50 backdrop-blur-sm border-gray-200 focus:bg-white transition-colors"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                className="pr-10 bg-white/50 backdrop-blur-sm border-gray-200 focus:bg-white transition-colors"
                                placeholder="Confirm password"
                                {...field}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <EyeIcon className="h-4 w-4 text-muted-foreground" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      {showValidations && password && (
                        <>
                          {passwordRequirements.map((req, index) => (
                            <div
                              key={index}
                              className="flex items-center text-sm space-x-2"
                            >
                              {req.regex.test(password) ? (
                                <Check className="h-3 w-3 text-green-500" />
                              ) : (
                                <X className="h-3 w-3 text-red-500" />
                              )}
                              <span
                                className={
                                  req.regex.test(password)
                                    ? "text-green-500"
                                    : "text-red-500"
                                }
                              >
                                {req.label}
                              </span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6 bg-primary hover:bg-primary/90 transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex justify-center">
            <div className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Sign in
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
