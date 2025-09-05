import styles from './modal-overlay.module.css';

type ModalOverlayProps = {
  onClose: () => void;
};

const ModalOverlay = ({ onClose }: ModalOverlayProps): React.JSX.Element => {
  return (
    <div
      className={styles.modalOverlay}
      onClick={(e) => {
        e.stopPropagation(); // Предотвращаем всплытие события
        onClose();
      }}
    />
  );
};

export default ModalOverlay;
