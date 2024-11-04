import React, { useState } from "react";
import api from "../lib/api";
import MarkdownDisplay from "../component/markdownDisplay";

const Playground = () => {
  const [inputText, setInputText] = useState<string>("");
  const [messages, setMessages] = useState<{ user: string; ai: string }[]>([]);
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

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
      });

      const aiResponse = response.data;

      // AIのレスポンスを追加
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].ai = aiResponse; // 最後のメッセージにAIのレスポンスを追加
        return newMessages;
      });
    } catch (error) {
      console.error("AIからのレスポンス取得に失敗しました:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container bg-gray-700 pb-8">
      <input
        type="text"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        placeholder="Pass"
        className="input-field"
      />
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <div className="ai-message bg-sky-200 rounded-lg p-4 m-4 self-start">
              YOU: {msg.user}
            </div>
            {loading && (
              <div className="p-12 text-red-400 font-bold text-4xl">
                loading.....
              </div>
            )}
            {msg.ai && (
              <div className="ai-message bg-red-100 rounded-lg p-4 m-4 self-start">
                AI: {<MarkdownDisplay content={msg.ai} />}
              </div>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="input-form flex">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="メッセージを入力..."
          className="input-field w-full m-4 p-3"
        />
        <button
          type="submit"
          disabled={!!loading}
          className={`submit-button rounded-md px-2 py-1  my-4 mr-4 ${
            loading ? "bg-orange-200" : "bg-orange-300"
          }`}
        >
          SUBMIT
        </button>
      </form>
    </div>
  );
};

export default Playground;
