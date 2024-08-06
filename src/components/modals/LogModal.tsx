import React from "react";
import Modal from "react-modal";
import styles from "./LogModal.module.scss";

interface LogModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  messages: { role: 'user' | 'ai'; message: string }[];
}

const LogModal: React.FC<LogModalProps> = ({ isOpen, onRequestClose, messages }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={styles.modal}
      overlayClassName={styles.overlay}
      contentLabel="Chat Log"
    >
      <h2>대화 내역</h2>
      <button className={styles.closeButton} onClick={onRequestClose}>
        닫기
      </button>
      <div className={styles.chatLog}>
        {messages.map((msg, index) => (
          <div key={index} className={`${styles.message} ${styles[msg.role]}`}>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default LogModal;
