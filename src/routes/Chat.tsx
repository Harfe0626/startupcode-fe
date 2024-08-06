import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogModal from "../components/modals/LogModal";
import styles from "./styles/Chat.module.scss";
import characterImage from "../assets/char.png";
import useStore from "../store/store";

interface Message {
  role: 'user' | 'ai';
  message: string;
}

const Chat: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const aiMessageRef = useRef<HTMLParagraphElement | null>(null);

    // zustand 스토어에서 상태와 함수 가져오기
    const { thread_id, chat_list, setThreadId, addToChatList, clearChatList } = useStore();
  
    useEffect(() => {
      if (!thread_id) {
        // 새로운 thread_id를 생성하거나 가져오는 로직을 추가
        const newThreadId = generateThreadId();
        setThreadId(newThreadId);
      }
    }, [thread_id, setThreadId]);

    const generateThreadId = () => {
      // thread_id 생성 로직 (예: UUID, timestamp 등)
      return 'thread-' + Math.random().toString(36).substr(2, 9);
    };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async () => {
    if (inputValue.trim() === "") return;

    const data = {
      thread_id: thread_id,
      message: inputValue,
    };

    try {
      const response = await fetch("https://your-api-endpoint.com/api", {
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
      console.log("Success:", responseData);

      setThreadId(responseData.thread_id);
      addToChatList(JSON.stringify({ role: 'user', message: inputValue }));
      addToChatList(JSON.stringify({ role: 'ai', message: responseData.message }));

      // 요청이 성공한 경우에만 navigate 호출
      // navigate("/result");
    } catch (error) {
      console.error("Error:", error);
      // 요청이 실패한 경우 navigate를 호출하지 않음
    }
    setInputValue("");
  };

  useEffect(() => {
    const aiMessages = chat_list.map(msg => JSON.parse(msg) as Message).filter(msg => msg.role === 'ai');
    if (aiMessageRef.current && aiMessages.length > 0) {
      aiMessageRef.current.textContent = aiMessages[aiMessages.length - 1].message;
    }
  }, [chat_list]);

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
      <LogModal isOpen={isModalOpen} onRequestClose={closeModal} messages={chat_list.map(msg => JSON.parse(msg) as Message)} />
    </div>
  );
};

export default Chat;
