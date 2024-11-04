// src/pages/Login.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api, { authApi } from "../lib/api";
import { useAuthStore } from "../stores/auth";

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(0);

  useEffect(() => {
    const fetchStatus = async () => {
      setStatus(0);
      try {
        const response = await api.get("/status");
        setStatus(response.data.status);
      } catch (error) {
        console.error("ステータスの取得に失敗しました:", error);
      }
    };
    fetchStatus();
  }, []);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      navigate("/dashboard");
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {loginMutation.isError && (
              <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
                <p>
                  {loginMutation.error?.message || "ログインに失敗しました"}
                </p>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                EMAIL
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                PASSWORD
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loginMutation.isPending ? "....." : "LOGIN"}
              </button>
            </div>
          </form>
          {!!status && (
            <div className="flex justify-between">
              <button
                onClick={() => navigate("/dashboard")}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              >
                DASHBOARD
              </button>
              <button
                onClick={() => navigate("/playground")}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              >
                PLAYGROUND
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
