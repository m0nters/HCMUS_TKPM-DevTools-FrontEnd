import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

const Login = () => {
  return (
    <>
      <article>
        <title>Login | IT Tools</title>
        <meta
          name="description"
          content="Login to access your account and manage your tools"
        />
      </article>
      <div className="w-full max-w-md mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm my-20">
        <h2 className="text-2xl font-bold text-center mb-8">Login</h2>

        <form className="space-y-5">
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
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-gray-600 hover:text-black">
              Forgot password?
            </a>
          </div>

          <Button type="submit" className="w-full" variant="primary">
            <div className="flex justify-center items-center w-full gap-2 group-hover:gap-4 transition-all duration-50">
              <span>Login</span>
              <ArrowUpRightIcon className="w-4 h-4" />
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
    </>
  );
};

export default Login;
