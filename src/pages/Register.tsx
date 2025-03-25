import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm my-20">
      <h2 className="text-2xl font-bold text-center mb-8">Đăng ký tài khoản</h2>

      <form className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Tên của bạn
          </label>
          <input
            id="name"
            type="text"
            placeholder="Họ và tên"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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
            placeholder="Tối thiểu 8 ký tự"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            type="checkbox"
            className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
            Tôi đồng ý với{" "}
            <a href="#" className="text-black hover:underline">
              điều khoản sử dụng
            </a>
          </label>
        </div>

        <button className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black cursor-pointer">
          Đăng ký
        </button>
      </form>

      <p className="text-center text-gray-600 mt-6">
        Đã có tài khoản?{" "}
        <Link to="/login" className="text-black font-medium hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
};

export default Register;
