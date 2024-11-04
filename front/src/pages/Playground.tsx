import React, { useState } from "react";
import api from "../lib/api"; // API呼び出し用のライブラリ

const Playground = () => {
  const [inputText, setInputText] = useState<string>("");
  const [messages, setMessages] = useState<{ user: string; ai: string }[]>([]);
  const [pass, setPass] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText) return;

    // ユーザーのメッセージを追加
    setMessages((prev) => [...prev, { user: inputText, ai: "" }]);

    try {
      // AIにテキストを送信
      const response = await api.post("/generate", {
        text: inputText,
        chatPass: pass,
      });
      const aiResponse = response.data.response;
      console.log(aiResponse);

      // AIのレスポンスを追加
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].ai = aiResponse; // 最後のメッセージにAIのレスポンスを追加
        return newMessages;
      });
    } catch (error) {
      console.error("AIからのレスポンス取得に失敗しました:", error);
    }

    // 入力フィールドをクリア
    setInputText("");
  };

  return (
    <div className="chat-container">
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
            <div
              className="user-message"
              style={{
                backgroundColor: "#e0f7fa", // ユーザーのメッセージの背景色
                borderRadius: "10px",
                padding: "10px",
                margin: "5px 0",
                alignSelf: "flex-end", // ユーザーのメッセージを右寄せ
              }}
            >
              あなた: {msg.user}
            </div>
            {msg.ai && (
              <div
                className="ai-message"
                style={{
                  backgroundColor: "#f1f1f1", // AIのメッセージの背景色
                  borderRadius: "10px",
                  padding: "10px",
                  margin: "5px 0",
                  alignSelf: "flex-start", // AIのメッセージを左寄せ
                }}
              >
                AI: {msg.ai}
              </div>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="メッセージを入力..."
          className="input-field"
        />
        <button type="submit" className="submit-button">
          送信
        </button>
      </form>
    </div>
  );
};

export default Playground;
