import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuthStore } from "../stores/auth";

const Dashboard = () => {
  const [status, setStatus] = useState<number>(0);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get("/status");
        setStatus(response.data.status);
        setIsEnabled(response.data.status === 1);
      } catch (error) {
        console.error("ステータスの取得に失敗しました:", error);
      }
    };
    fetchStatus();
  }, []);

  const handleLoginRedirect = () => {
    navigate("/login");
  };
  const handleTopRedirect = () => {
    navigate("/playground");
  };

  const handleToggleChange = () => {
    setIsEnabled(!isEnabled);
  };

  const handleSubmit = async () => {
    try {
      const newStatus = isEnabled ? 1 : 0;
      if (!token) {
        // トークンが存在しない場合はログイン画面にリダイレクト
        navigate("/login");
        return;
      }
      const res = await api.post(
        "/status",
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus(newStatus);
      console.log("成功", res);
    } catch (error) {
      console.error("ステータスの更新に失敗しました:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1
        className={`text-3xl text-center font-bold ${
          status === 1 ? "text-red-500" : "text-black"
        }`}
      >
        {status === 1 ? "ACTIVE" : "INACTIVE"}
      </h1>
      <div
        className={`bg-white p-4 my-8 rounded-lg shadow-2xl ${
          status === 1 ? "shadow-red-600" : "shadow-black"
        }`}
      >
        <h1 className="text-3xl font-bold text-center mb-4">STATUS</h1>
        <label className="flex justify-center items-center mb-4">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={handleToggleChange}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="ml-2 text-lg">ACTIVE</span>
        </label>
        <button
          onClick={handleSubmit}
          className="w-full mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-blue-700 transition duration-200"
        >
          CHANGE STATUS
        </button>
      </div>
      <div className="flex space-x-4 mt-4">
        <button
          onClick={handleLoginRedirect}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
        >
          LOGIN
        </button>
        <button
          onClick={handleTopRedirect}
          className="px-4 py-2 bg-green-700 text-white rounded hover:bg-blue-700 transition duration-200"
        >
          PLAYGROUND
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
