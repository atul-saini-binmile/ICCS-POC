// MyModal.tsx
import React from "react";
import { Modal } from "react-bootstrap";
import styles from "./index.module.scss";
import { ICustomModalProps } from "../../utils/interface";

const CustomModal: React.FC<ICustomModalProps> = ({
  show,
  onHide,
  title,
  children,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className={styles.modalHeader}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>{children}</Modal.Body>
    </Modal>
  );
};

export default CustomModal;
