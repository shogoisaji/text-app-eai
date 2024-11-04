import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

const Index = () => {
  const [status, setStatus] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get("/status");
        setStatus(response.data.status);
      } catch (error) {
        console.error("ステータスの取得に失敗しました:", error);
      }
    };

    fetchStatus();
  }, []);

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {status === 1 ? (
        <div>
          <h1 className="text-2xl">Enable</h1>
        </div>
      ) : (
        <h1 className="text-2xl">Disable</h1>
      )}
      <button
        onClick={handleLoginRedirect}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        LOGIN
      </button>
    </div>
  );
};

export default Index;
