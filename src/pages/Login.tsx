import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AlertMessage, Button } from "../components/common";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { login as apiLogin } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { Threads, PasswordInput } from "../components/common/";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const userInfo = await apiLogin({ userName: username, password });
      login(userInfo, rememberMe);
      navigate("/"); // Redirect to home after successful login
    } catch (error: any) {
      console.error("Login failed:", error);
      setError("Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  const location = useLocation();
  const registrationMessage = location.state?.message;

  return (
    <>
      <article>
        <title>Login | IT Tools</title>
        <meta
          name="description"
          content="Login to access your account and manage your tools"
        />
      </article>
      <div className="relative w-full mx-auto">
        <Threads amplitude={1} distance={0} enableMouseInteraction={true} />
        <div className="relative max-w-md mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm my-20">
          <h2 className="text-2xl font-bold text-center mb-8">Login</h2>
          {registrationMessage && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down">
              <AlertMessage
                message={registrationMessage}
                isError={false}
                duration={5000}
                onDismiss={() => navigate("/login")}
              />
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 mb-4">
              {error}
            </div>
          )}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                disabled={isLoading}
              />
            </div>

            <PasswordInput
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 focus:ring-black border-gray-300 rounded accent-black"
                  disabled={isLoading}
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-gray-600 hover:text-black"
              >
                Forgot password?
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full"
              variant="primary"
              disabled={isLoading}
            >
              <div className="flex justify-center items-center w-full gap-2 group-hover:gap-4 transition-all duration-50">
                <span>{isLoading ? "Logging in..." : "Login"}</span>
                {!isLoading && <ArrowUpRightIcon className="w-4 h-4" />}
              </div>
            </Button>
          </form>
          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-black font-medium hover:underline"
            >
              Register now
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
