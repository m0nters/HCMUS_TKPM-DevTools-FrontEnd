import { Link } from "react-router-dom";

const Login = () => {
  return (
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
            Mật khẩu
          </label>
          <input
            id="password"
            type="password"
            placeholder="Nhập mật khẩu"
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
              Ghi nhớ đăng nhập
            </label>
          </div>
          <a href="#" className="text-sm text-gray-600 hover:text-black">
            Quên mật khẩu?
          </a>
        </div>

        <button className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
          Đăng nhập
        </button>
      </form>

      <p className="text-center text-gray-600 mt-6">
        Chưa có tài khoản?{" "}
        <Link to="/register" className="text-black font-medium hover:underline">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
};

export default Login;
