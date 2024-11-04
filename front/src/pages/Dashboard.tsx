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
    navigate("/");
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
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div>
        <h1 className="text-2xl">アプリケーションの状態:</h1>
        <label>
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={handleToggleChange}
          />
          有効
        </label>
        <button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          設定を切り替える
        </button>
      </div>
      {status === 1 ? (
        <h1 className="text-2xl">このアプリケーションが使えます。</h1>
      ) : (
        <h1 className="text-2xl">アプリケーションは利用できません。</h1>
      )}
      <button
        onClick={handleLoginRedirect}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        ログイン画面へ
      </button>
      <button
        onClick={handleTopRedirect}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Top
      </button>
    </div>
  );
};

export default Dashboard;
