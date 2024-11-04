import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

const Dashboard = () => {
  const [status, setStatus] = useState<number | null>(null);
  const [isEnabled, setIsEnabled] = useState<boolean>(false); // トグル用の状態を追加
  const navigate = useNavigate();

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
      const res = await api.post("/status", { status: newStatus });
      setStatus(newStatus);
      console.log("成功", res);
    } catch (error) {
      console.error("ステータスの更新に失敗しました:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 rounded-lg shadow-lg">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-4">STATUS</h1>
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={handleToggleChange}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="ml-2 text-lg">有効</span>
        </label>
        <button
          onClick={handleSubmit}
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
        >
          設定を切り替える
        </button>
      </div>
      <h1 className="text-2xl text-center mt-4">
        {status === 1
          ? "このアプリケーションが使えます。"
          : "アプリケーションは利用できません。"}
      </h1>
      <div className="flex space-x-4 mt-4">
        <button
          onClick={handleLoginRedirect}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
        >
          LOGIN
        </button>
        <button
          onClick={handleTopRedirect}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
        >
          PLAYGROUND
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
