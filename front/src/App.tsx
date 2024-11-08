// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "./stores/auth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import Playground from "./pages/Playground";
import { useEffect } from "react";

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const interval = setInterval(() => {
      useAuthStore.getState().checkEnabled();
    }, 1000); // 1秒ごとに更新

    return () => clearInterval(interval); // クリーンアップ
  }, []);

  return (
    <div className={`p-2 ${token ? "bg-red-500" : "ba-black"}`}>
      <div className="bg-gray-700 min-h-screen rounded-lg">
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/playground" element={<Playground />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </div>
    </div>
  );
}

export default App;
