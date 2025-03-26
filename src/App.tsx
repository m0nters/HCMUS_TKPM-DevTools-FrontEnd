import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/layout/Header";
import AppRoutes from "./routes";
import Footer from "./components/layout/Footer";

const App = () => {
  return (
    <Router>
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
    </Router>
  );
};

export default App;
