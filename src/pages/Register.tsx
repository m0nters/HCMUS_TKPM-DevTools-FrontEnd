import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/common";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { Threads, AlertMessage, PasswordInput } from "../components/common/";
import { register } from "../services/authService";
import { memo } from "react";
const MemoizedThreads = memo(Threads);

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validateFields = () => {
    if (Object.values(formData).some((value) => !value)) {
      setError("All fields are required");
      return;
    }

    if (!agreeToTerms) {
      setError("You must agree to the terms of service");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Password validation (min 8 chars, uppercase, lowercase, number, special char)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number and special character"
      );
      return;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    validateFields();

    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);

      // Registration successful
      navigate("/login", {
        state: {
          message:
            "Registration successful! Please log in with your credentials.",
          from: location.state?.from || "/",
        },
      });
    } catch (err: any) {
      // Handle specific error responses if your API provides them
      console.error("Registration error:", err);
      setError(
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

          {error && (
            <AlertMessage
              message={error}
              isError={true}
              duration={3000}
              onDismiss={() => setError("")}
            />
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
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
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                disabled={isLoading}
              />
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
                value={formData.userName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                disabled={isLoading}
              />
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
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                disabled={isLoading}
              />
            </div>
            <PasswordInput
              id="password"
              label="Password"
              placeholder="Enter new password"
              value={formData.password}
              onChange={handleChange}
              required
              helpText="Required: Minimum 8 characters, with uppercase, lowercase, number and special character."
            />
            <PasswordInput
              id="confirmPassword"
              label="Confirm password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded accent-black"
                disabled={isLoading}
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-700"
              >
                I agree to{" "}
                <Link to="/terms" className="text-black hover:underline">
                  terms of service
                </Link>
              </label>
            </div>
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
};

export default Register;
