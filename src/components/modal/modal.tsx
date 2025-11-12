import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import ModalOverlay from './modal-overlay/modal-overlay';

import styles from './modal.module.css';

const modalRoot = document.getElementById('react-modals');

type ModalProps = {
  header?: string;
  onClose: () => void;
  children?: React.ReactNode;
};

export const Modal = ({ header, onClose, children }: ModalProps): React.JSX.Element => {
  useEffect(() => {
    const close = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', close);

    return (): void => {
      window.removeEventListener('keydown', close);
    };
  }, [onClose]);

  return createPortal(
    <section>
      <div
        data-testid="modal"
        onClick={(e) => e.stopPropagation()}
        className={styles.modal}
      >
        {header ? (
          <div
            data-testid="modal-title"
            className={`${styles.modalHeader} ml-10 mr-10 mt-10`}
          >
            <p className="text text_type_main-large">{header}</p>
            <div className={styles.closeModalCursor}>
              <CloseIcon
                type="primary"
                data-testid="modal-close"
                onClick={() => {
                  onClose();
                }}
              />
            </div>
          </div>
        ) : (
          <div>
            <div className={`${styles.closeModalIcon} mr-10 mt-15`}>
              <CloseIcon
                type="primary"
                data-testid="modal-close"
                onClick={() => {
                  onClose();
                }}
              />
            </div>
          </div>
        )}
        {children}
      </div>
      <ModalOverlay onClose={onClose} />
    </section>,
    modalRoot as Element
  );
};
