import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { memo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import { AlertMessage, Button, PasswordInput, Threads } from "../components/";
import { useAuth } from "../hooks/";
import { login as apiLogin } from "../services/";
import { estimateReadingTime } from "../utils/";

const MemoizedThreads = memo(Threads);

interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

export function Login() {
  const { login } = useAuth();
  const location = useLocation();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [redirectMessage, setRedirectMessage] = useState(
    location.state?.message,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    setIsLoading(true);

    try {
      const userInfo = await apiLogin({
        userName: data.username,
        password: data.password,
      });
      login(userInfo, data.rememberMe);
      /**
       * We don't need to redirect here, since `Login` or `Register`
       * has been wrapped in `UnauthenticatedRoute` and it will
       * either navigate to the previous page or to the home page
       */
    } catch (error: any) {
      console.error("Login failed:", error);
      setError("Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <article>
        <title>Login | IT Tools</title>
        <meta
          name="description"
          content="Login to access your account and manage your tools"
        />
      </article>
      <div className="relative mx-auto w-full">
        <MemoizedThreads
          amplitude={1}
          distance={0}
          enableMouseInteraction={true}
        />
        <div className="relative mx-auto my-20 max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-8 text-center text-2xl font-bold">Login</h2>

          {location.state && redirectMessage && (
            <AlertMessage
              message={redirectMessage}
              isError={location.state?.isError || false}
              duration={
                location.state.isPersistent
                  ? 0
                  : estimateReadingTime(redirectMessage)
              }
              onDismiss={() => {
                setRedirectMessage("");
              }}
              position="top-center"
            />
          )}

          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-800">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
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
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                })}
                className={`w-full rounded-md border p-3 focus:border-transparent focus:ring-2 focus:outline-none ${
                  errors.username
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
                disabled={isLoading}
              />
              {errors.username && (
                <p className="text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            <PasswordInput
              id="password"
              label="Password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
              })}
              error={errors.password?.message}
              disabled={isLoading}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  {...register("rememberMe")}
                  className="h-4 w-4 rounded border-gray-300 accent-black focus:ring-black"
                  disabled={isLoading}
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              {/* <Link
                to="/forgot-password"
                className="text-sm text-gray-600 hover:text-black"
              >
                Forgot password?
              </Link> */}
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="w-full"
            >
              <div className="flex items-center justify-center gap-2 transition-all duration-50 group-hover:gap-4">
                <span>{isLoading ? "Logging in..." : "Login"}</span>
                {!isLoading && <ArrowUpRightIcon className="h-4 w-4" />}
              </div>
            </Button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-black hover:underline"
            >
              Register now
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
