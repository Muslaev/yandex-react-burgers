import styles from './modal-overlay.module.css';

type ModalOverlayProps = {
  onClose: () => void;
};

const ModalOverlay = ({ onClose }: ModalOverlayProps): React.JSX.Element => {
  return (
    <div
      data-testid="modal-overlay"
      className={styles.modalOverlay}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    />
  );
};

export default ModalOverlay;
