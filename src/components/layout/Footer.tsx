export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-100 py-6">
      <div className="mx-auto flex max-w-7xl flex-col space-y-2 px-4 text-center text-sm text-gray-500">
        <span>
          © {new Date().getFullYear()} TKPM - Project #2 - Bộ ứng dụng hỗ trợ
          lập trình viên (IT tools for developers). All rights reserved.
        </span>
        <span>Authors: Phạm Nguyên Khánh, Trịnh Anh Tài</span>
      </div>
    </footer>
  );
}
