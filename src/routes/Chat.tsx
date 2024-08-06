import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogModal from "../components/modals/LogModal";
import styles from "./styles/Chat.module.scss";
import characterImage from "../assets/char.png";

interface Message {
  role: 'user' | 'ai';
  message: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const aiMessageRef = useRef<HTMLParagraphElement | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    if (inputValue.trim() !== "") {
      const userMessage: Message = { role: 'user', message: inputValue };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      // Mock AI response
      setTimeout(() => {
        const aiMessage: Message = { role: 'ai', message: `${inputValue}` };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      }, 1000);

      setInputValue("");
    }
  };

  useEffect(() => {
    const aiMessages = messages.filter(msg => msg.role === 'ai');
    if (aiMessageRef.current && aiMessages.length > 0) {
      aiMessageRef.current.textContent = aiMessages[aiMessages.length - 1].message;
    }
  }, [messages]);

  const handleRestart = () => {
    navigate(0);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="background">
        <div className="pc-background"></div>
        <div className={styles["chat-background"]}>
          <div className={styles["chat-container"]}>
            <button className={styles["log-button"]} onClick={openModal}>
              =
            </button>
            <div className={`${styles["chat-message"]} ${styles["ai"]}`}>
              <img src={characterImage} alt="Character" />
              <p ref={aiMessageRef}></p>
            </div>
            <input
              type="text"
              className={styles["chat-input"]}
              placeholder="입력하세요..."
              value={inputValue}
              onChange={handleInputChange}
            />
            <div className={styles["chat-button-container"]}>
              <button
                className={`${styles["chat-button"]} ${styles["secondary"]}`}
                onClick={handleRestart}
              >
                다시 하기
              </button>
              <button className={styles["chat-button"]} onClick={handleSubmit}>
                전송
              </button>
            </div>
          </div>
        </div>
      </div>
      <LogModal isOpen={isModalOpen} onRequestClose={closeModal} messages={messages} />
    </div>
  );
};

export default Chat;
