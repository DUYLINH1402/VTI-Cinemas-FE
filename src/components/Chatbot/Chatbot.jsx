import React, { useState, useEffect } from "react";
import { sendMessageToChatbot } from "../../services/chatbotService";
import "./Chatbot.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    setMessages([
      {
        text: "Chúc bạn ngày mới tốt lành! Mình là Chatbot Hỗ Trợ của VTI Cinema. Bạn muốn đặt vé xem phim, tìm rạp, hay biết thêm về khuyến mãi? Hãy nói với mình nhé!",
        sender: "bot",
        isWelcome: true,
      },
    ]);
  }, []);

  const sendMessage = async (text = input) => {
    if (!text) return;

    const userMessage = { text, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const botResponse = await sendMessageToChatbot(text);
      setMessages((prevMessages) => [...prevMessages, { text: botResponse, sender: "bot" }]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setIsLoading(false);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handleQuickReply = (text) => {
    sendMessage(text);
  };

  return (
    <div className="chatbot-container">
      {/* Tiêu đề hộp thoại */}
      <div className="chatbot-header">
        <span>Chatbot Hỗ Trợ</span>
        <button className="close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
      {/* Nội dung */}
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender} ${msg.isWelcome ? "welcome-message" : ""}`}>
            <div className="message-content">
              {/* <b>{msg.sender === "user" ? "Bạn" : "Bot"}: </b> */}
              <pre style={{ display: "inline", whiteSpace: "pre-wrap", margin: 0 }}>{msg.text}</pre>
            </div>
          </div>
        ))}
      </div>
      {/* Loading Bot đang phản hồi */}

      {isLoading && (
        <div className="message bot">
          <div className="message-content typing">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      )}
      {/* Câu hỏi nhanh */}
      <div className="chatbot-quick-replies">
        <button onClick={() => handleQuickReply("Đặt vé")}>Đặt vé</button>
        <button onClick={() => handleQuickReply("Khuyến mãi")}>Khuyến mãi</button>
        <button onClick={() => handleQuickReply("Thanh toán")}>Thanh toán</button>
      </div>
      <div className="chatbot-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập tin nhắn..."
        />
        <button onClick={() => sendMessage()}>Gửi</button>
      </div>
    </div>
  );
};

export default Chatbot;
