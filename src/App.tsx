import { useEffect } from "react";
import { Footer, Header } from "./components/";
import { AuthProvider, FavoritesProvider } from "./contexts/";
import { useAuth } from "./hooks/";
import { AppRoutes } from "./routes/";
import { isTokenExpired } from "./services/";

const App = () => {
  const { isAuth, logout } = useAuth();

  // Check token expiration on app initialization and when route changes
  useEffect(() => {
    if (isAuth && isTokenExpired()) {
      logout("/login", {
        message: "Your session has expired. Please log in again.",
        isError: true,
      });
    }
  }, [isAuth]);

  return (
    <AuthProvider>
      <FavoritesProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {/* Header appears on all pages */}
          <Header />
          {/* Main content */}
          <main className="flex-grow flex justify-center pt-[74px]">
            <AppRoutes />
          </main>
          {/* Footer appears on all pages */}
          <Footer />
        </div>
      </FavoritesProvider>
    </AuthProvider>
  );
};

export default App;
