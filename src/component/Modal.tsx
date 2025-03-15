
import React from "react";
import styles from "./Modal.module.css";

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

const Modal = ({ children, isOpen, onClose }: Props) => {
  if (!isOpen) return null;

  return (
    <div id="modal" className={styles.modalOverlay}>
      <div className={styles.fade} onClick={onClose}></div>
      <div className={styles.modalContent}>
        <h2>Atualizar Tarefa</h2>
        {children}
      </div>
    </div>
  );
};

export default Modal;