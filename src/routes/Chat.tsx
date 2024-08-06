import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogModal from "../components/modals/LogModal";
import styles from "./styles/Chat.module.scss";
import characterImage from "../assets/char.png";
import useStore from "../store/store";

const Chat: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const { thread_id, chat_list, clearChatList } = useStore();
  const addToChatList = useStore((state) => state.addToChatList);
  const [message, setMessage] = useState<string>("");

  const [inputValue, setInputValue] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMessage(chat_list[count]);
  }, [Math.floor(count / 2), chat_list, count]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async () => {
    const data = {
      thread_id: thread_id,
      chat_message: inputValue,
    };

    addToChatList(data.chat_message);
    setCount(count + 1);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      const responseData = await response.json();
      addToChatList(responseData.chat_message);
      setCount(count + 1);
      if (responseData.body.isend === "true") {
        navigate("/result");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRestart = () => {
    clearChatList();
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
            <div className={styles["chat-message"]}>
              <img src={characterImage} alt="Character" />
              <p>{message}</p>
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
      <LogModal 
        isOpen={isModalOpen} 
        onRequestClose={closeModal} 
        messages={chat_list.map((msg, index) => ({ 
          role: index % 2 === 0 ? 'user' : 'ai', 
          message: msg 
        }))} 
      />
    </div>
  );
};

export default Chat;
