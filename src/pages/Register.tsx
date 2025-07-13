import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { memo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AlertMessage, Button, PasswordInput, Threads } from "../components/";
import { register as registerService } from "../services/";

const MemoizedThreads = memo(Threads);

interface RegisterFormData {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      fullName: "",
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    setSubmitError("");
    setIsLoading(true);

    try {
      const { confirmPassword, agreeToTerms, ...registerData } = data;
      await registerService(registerData);

      // Registration successful
      navigate("/login", {
        state: {
          message:
            "Registration successful! Please log in with your credentials.",
          from: location.state?.from || "/",
        },
      });
    } catch (err: any) {
      console.error("Registration error:", err);
      setSubmitError(
        "Registration failed. Maybe username or email already exists. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <article>
        <title>Register | IT Tools</title>
        <meta
          name="description"
          content="Register to access your account and manage your tools"
        />
      </article>
      <div className="relative w-full mx-auto">
        <MemoizedThreads
          amplitude={1}
          distance={0}
          enableMouseInteraction={true}
        />
        <div className="relative max-w-md mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm my-20">
          <h2 className="text-2xl font-bold text-center mb-8">Register</h2>

          {submitError && (
            <AlertMessage
              message={submitError}
              isError={true}
              duration={3000}
              onDismiss={() => setSubmitError("")}
            />
          )}

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Full Name (John Doe)"
                {...register("fullName", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Full name must be at least 2 characters",
                  },
                })}
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.fullName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
                disabled={isLoading}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="userName"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="userName"
                type="text"
                placeholder="Username (e.g. michael123)"
                {...register("userName", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message:
                      "Username can only contain letters, numbers, and underscores",
                  },
                })}
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.userName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
                disabled={isLoading}
              />
              {errors.userName && (
                <p className="text-red-500 text-sm">
                  {errors.userName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="email@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <PasswordInput
                id="password"
                label="Password"
                placeholder="Enter new password"
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
                    message:
                      "Password must be at least 8 characters and include uppercase, lowercase, number and special character",
                  },
                })}
                error={errors.password?.message}
                helpText="Required: Minimum 8 characters, with uppercase, lowercase, number and special character."
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <PasswordInput
                id="confirmPassword"
                label="Confirm password"
                placeholder="Re-enter your password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                error={errors.confirmPassword?.message}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center">
              <input
                id="agreeToTerms"
                type="checkbox"
                {...register("agreeToTerms", {
                  required: "You must agree to the terms of service",
                })}
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded accent-black"
                disabled={isLoading}
              />
              <label
                htmlFor="agreeToTerms"
                className="ml-2 block text-sm text-gray-700"
              >
                I agree to{" "}
                <Link to="/terms" className="text-black hover:underline">
                  terms of service
                </Link>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-red-500 text-sm">
                {errors.agreeToTerms.message}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              variant="primary"
              disabled={isLoading}
            >
              <div className="flex justify-center items-center w-full gap-2 group-hover:gap-4 transition-all duration-50">
                <span>{isLoading ? "Registering..." : "Register"}</span>
                {!isLoading && <ArrowUpRightIcon className="w-4 h-4" />}
              </div>
            </Button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-black font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
