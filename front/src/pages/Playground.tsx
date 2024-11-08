import React, { useEffect, useRef, useState } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";
import MarkdownDisplay from "../component/markdownDisplay";

const Playground = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState<string>("");
  const [messages, setMessages] = useState<{ user: string; ai: string }[]>([]);
  const [pass, setPass] = useState("");
  const [expire, setExpire] = useState("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [status, setStatus] = useState(0);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedModel, setSelectedModel] = useState("flash");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(event.target.value);
  };

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto"; // style プロパティは HTMLTextAreaElement に存在します
    textarea.style.height = `${textarea.scrollHeight}px`; // scrollHeight プロパティは HTMLTextAreaElement に存在します
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get("/status");
        setStatus(response.data.status);
        setExpire(response.data.expire);
        if (response.data.status === 0) {
          navigate("/login");
        }
      } catch (error) {
        console.error("ステータスの取得に失敗しました:", error);
        navigate("/login");
      }
    };
    fetchStatus();
  }, [navigate]);

  useEffect(() => {
    const calLimit = () => {
      const endTime = new Date(expire);
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();
      const diffMinutes = Math.floor(diff / (1000 * 60));
      setTimeLeft(diffMinutes);
    };

    calLimit();

    const interval = setInterval(() => {
      calLimit();

      if (timeLeft <= 0) {
        clearInterval(interval);
        navigate("/login");
      }
    }, 60000); // 1分ごとに更新

    return () => clearInterval(interval); // クリーンアップ
  }, [expire, navigate, timeLeft]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText) return;

    // ユーザーのメッセージを追加
    setMessages((prev) => [...prev, { user: inputText, ai: "" }]);

    try {
      setLoading(true);

      const text = inputText;
      setInputText("");

      const response = await api.post("/generate", {
        text: text,
        chatPass: pass,
        model: selectedModel,
      });

      const aiResponse = response.data;

      // AIのレスポンスを追加
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].ai = aiResponse; // 最後のメッセージにAIのレスポンスを追加
        return newMessages;
      });
    } catch (error) {
      console.error("レスポンス取得に失敗しました:", error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  if (status === 0)
    return (
      <div>
        <button
          onClick={handleLoginRedirect}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          LOGIN
        </button>
      </div>
    );

  return (
    <div className="pb-8">
      <div className="flex justify-between p-3">
        <div className="flex flex-col md:flex-row items-start">
          <div className="px-4 py-2 mr-6 md:mb-0 mb-2 text-white bg-lime-600 rounded">
            {timeLeft} m
          </div>
          <button
            onClick={handleLoginRedirect}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            LOGIN
          </button>
        </div>
        <div className="flex flex-col items-end justify-start">
          <div className="mb-4">
            <input
              type="text"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder=" Pass"
              className="input-field rounded-sm p-1"
            />
          </div>
          <div>
            <select
              id="select-model"
              value={selectedModel}
              onChange={handleChange}
              className="px-2 py-1"
            >
              <option value="flash">Flash</option>
              <option value="pro">Pro</option>
            </select>
          </div>
        </div>
      </div>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <div className="ai-message bg-sky-200 rounded-lg p-4 m-4 self-start">
              YOU: {msg.user}
            </div>
            {msg.ai && (
              <div className="ai-message bg-red-100 rounded-lg p-4 m-4 self-start">
                AI: {<MarkdownDisplay content={msg.ai} />}
              </div>
            )}
          </div>
        ))}
      </div>
      {loading && (
        <div className="p-8 text-red-400 font-bold text-4xl">loading.....</div>
      )}
      <form onSubmit={handleSubmit} className="input-form flex items-end">
        <textarea
          ref={textareaRef}
          placeholder="メッセージを入力..."
          className="p-2 m-4 w-full"
          onInput={adjustHeight}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <div>
          <button
            type="submit"
            disabled={!!loading}
            className={`font-bold text-white rounded-md px-2 py-2  my-4 mr-4 ${
              loading ? "bg-orange-200" : "bg-orange-300"
            }`}
          >
            SUBMIT
          </button>
        </div>
      </form>
    </div>
  );
};

export default Playground;
