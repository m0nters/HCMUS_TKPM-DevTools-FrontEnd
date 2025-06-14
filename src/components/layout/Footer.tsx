export function Footer() {
  return (
    <footer className="mt-auto py-6 bg-gray-100 border-t border-gray-200">
      <div className="flex flex-col space-y-2 max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
        <span>
          © {new Date().getFullYear()} TKPM - Project #2 - Bộ ứng dụng hỗ trợ
          lập trình viên (IT tools for developers). All rights reserved.
        </span>
        <span>Authors: Phạm Nguyên Khánh, Trịnh Anh Tài</span>
      </div>
    </footer>
  );
}
